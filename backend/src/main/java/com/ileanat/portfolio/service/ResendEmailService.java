package com.ileanat.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResendEmailService implements EmailSender {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final RestClient restClient;
    private final String apiKey;
    private final String fromEmail;

    public ResendEmailService(
            RestClient.Builder restClientBuilder,
            @Value("${resend.api-key:}") String apiKey,
            @Value("${resend.from-email:}") String fromEmail
    ) {
        this.restClient = restClientBuilder.build();
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.fromEmail = fromEmail == null ? "" : fromEmail.trim();
    }

    @Override
    public boolean isConfigured() {
        return !apiKey.isBlank() && !fromEmail.isBlank();
    }

    @Override
    public void sendEmail(String to, String subject, String text) {
        sendEmail(to, subject, text, null);
    }

    @Override
    public void sendEmail(String to, String subject, String text, String replyTo) {
        if (!isConfigured()) {
            throw new IllegalStateException("Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.");
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("from", fromEmail);
        payload.put("to", List.of(to));
        payload.put("subject", subject);
        payload.put("text", text);
        if (replyTo != null && !replyTo.isBlank()) {
            payload.put("reply_to", replyTo);
        }

        try {
            restClient.post()
                    .uri(RESEND_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + apiKey)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Resend email sent to {}", to);
        } catch (RestClientResponseException ex) {
            log.error("Resend email failed for {}: {}", to, ex.getResponseBodyAsString());
            throw ex;
        } catch (Exception ex) {
            log.error("Resend email failed for {}: {}", to, ex.getMessage());
            throw ex;
        }
    }
}
