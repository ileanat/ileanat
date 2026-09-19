package com.ileanat.portfolio.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ileanat.portfolio.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Component
public class AdminApiKeyInterceptor implements HandlerInterceptor {

    private final String adminApiKey;
    private final ObjectMapper objectMapper;

    public AdminApiKeyInterceptor(
            @Value("${location.access.admin-api-key:}") String adminApiKey,
            ObjectMapper objectMapper
    ) {
        this.adminApiKey = adminApiKey == null ? "" : adminApiKey.trim();
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if (adminApiKey.isBlank()) {
            writeError(response, HttpServletResponse.SC_SERVICE_UNAVAILABLE, "Admin access is not configured.");
            return false;
        }

        String providedKey = request.getHeader("X-Admin-Api-Key");
        if (providedKey == null || !constantTimeEquals(adminApiKey, providedKey.trim())) {
            writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized.");
            return false;
        }

        return true;
    }

    private void writeError(HttpServletResponse response, int status, String message) throws Exception {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), new ErrorResponse(message));
    }

    private boolean constantTimeEquals(String expected, String provided) {
        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        byte[] providedBytes = provided.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(expectedBytes, providedBytes);
    }
}
