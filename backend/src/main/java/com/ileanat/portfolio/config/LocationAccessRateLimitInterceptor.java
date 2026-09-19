package com.ileanat.portfolio.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ileanat.portfolio.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LocationAccessRateLimitInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper;
    private final int submitLimitPerMinute;
    private final int validateLimitPerMinute;
    private final Map<String, Deque<Long>> submitBuckets = new ConcurrentHashMap<>();
    private final Map<String, Deque<Long>> validateBuckets = new ConcurrentHashMap<>();

    public LocationAccessRateLimitInterceptor(
            ObjectMapper objectMapper,
            @Value("${location.access.rate-limit.submit-per-minute:5}") int submitLimitPerMinute,
            @Value("${location.access.rate-limit.validate-per-minute:30}") int validateLimitPerMinute
    ) {
        this.objectMapper = objectMapper;
        this.submitLimitPerMinute = submitLimitPerMinute;
        this.validateLimitPerMinute = validateLimitPerMinute;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String path = request.getRequestURI();
        String clientKey = resolveClientKey(request);

        if ("POST".equalsIgnoreCase(request.getMethod()) && path.endsWith("/api/location-access/requests")) {
            return allowRequest(clientKey, submitBuckets, submitLimitPerMinute, response);
        }

        if ("GET".equalsIgnoreCase(request.getMethod()) && path.endsWith("/api/location-access/validate")) {
            return allowRequest(clientKey, validateBuckets, validateLimitPerMinute, response);
        }

        return true;
    }

    private boolean allowRequest(
            String clientKey,
            Map<String, Deque<Long>> buckets,
            int limitPerMinute,
            HttpServletResponse response
    ) throws Exception {
        long now = System.currentTimeMillis();
        long windowStart = now - Duration.ofMinutes(1).toMillis();

        Deque<Long> bucket = buckets.computeIfAbsent(clientKey, key -> new ArrayDeque<>());
        synchronized (bucket) {
            while (!bucket.isEmpty() && bucket.peekFirst() < windowStart) {
                bucket.removeFirst();
            }

            if (bucket.size() >= limitPerMinute) {
                writeError(response, "Too many requests. Please try again later.");
                return false;
            }

            bucket.addLast(now);
        }

        return true;
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr() == null ? "unknown" : request.getRemoteAddr();
    }

    private void writeError(HttpServletResponse response, String message) throws Exception {
        response.setStatus(429);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), new ErrorResponse(message));
    }
}
