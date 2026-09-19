package com.ileanat.portfolio.service;

import com.ileanat.portfolio.entity.LocationAccessRequestEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class LocationAccessNotificationService {

    private static final Logger log = LoggerFactory.getLogger(LocationAccessNotificationService.class);
    private static final DateTimeFormatter TIMESTAMP_FORMATTER =
            DateTimeFormatter.ofPattern("MMMM d, yyyy 'at' h:mm a z")
                    .withZone(ZoneId.of("America/New_York"));

    private final EmailSender emailSender;
    private final String ownerRecipient;
    private final String adminPageUrl;
    private final String requesterPageUrl;

    public LocationAccessNotificationService(
            EmailSender emailSender,
            @Value("${location.access.notification-recipient:${contact.recipient}}") String ownerRecipient,
            @Value("${location.access.admin-page-url:}") String adminPageUrl,
            @Value("${location.access.requester-page-url:}") String requesterPageUrl
    ) {
        this.emailSender = emailSender;
        this.ownerRecipient = ownerRecipient;
        this.adminPageUrl = adminPageUrl == null ? "" : adminPageUrl.trim();
        this.requesterPageUrl = requesterPageUrl == null ? "" : requesterPageUrl.trim();
    }

    public void notifyOwnerOfNewRequest(LocationAccessRequestEntity request) {
        if (!emailSender.isConfigured()) {
            log.warn(
                    "Owner location access notification skipped: Resend is not configured for request {}",
                    request.getId()
            );
            return;
        }

        if (ownerRecipient.isBlank()) {
            log.warn(
                    "Owner location access notification skipped: notification recipient is not configured for request {}",
                    request.getId()
            );
            return;
        }

        try {
            emailSender.sendEmail(
                    ownerRecipient,
                    "New location access request from " + request.getRequesterName(),
                    buildOwnerEmailBody(request),
                    request.getRequesterEmail()
            );
            log.info("Owner location access notification sent for request {}", request.getId());
        } catch (Exception ex) {
            log.error(
                    "Owner location access notification failed for request {}: {}",
                    request.getId(),
                    ex.getMessage()
            );
        }
    }

    public void notifyRequesterOfApproval(
            LocationAccessRequestEntity request,
            String plainToken,
            Instant expiresAt
    ) {
        if (!emailSender.isConfigured()) {
            log.warn(
                    "Requester approval notification skipped: Resend is not configured for request {}",
                    request.getId()
            );
            return;
        }

        try {
            emailSender.sendEmail(
                    request.getRequesterEmail(),
                    "Your location access request was approved",
                    buildRequesterApprovalEmailBody(request, plainToken, expiresAt)
            );
            log.info("Requester approval notification sent for request {}", request.getId());
        } catch (Exception ex) {
            log.error(
                    "Requester approval notification failed for request {}: {}",
                    request.getId(),
                    ex.getMessage()
            );
        }
    }

    private String buildOwnerEmailBody(LocationAccessRequestEntity request) {
        String messageText = request.getMessage() == null || request.getMessage().isBlank()
                ? "None provided"
                : request.getMessage();
        String timestamp = TIMESTAMP_FORMATTER.format(request.getCreatedAt());
        String adminLink = buildAdminLink(request.getId().toString());

        return """
                New location access request

                Name: %s
                Email: %s
                Message: %s
                Requested at: %s

                Review this request in your private admin panel:
                %s

                This link opens the admin page only. It does not approve the request automatically.
                """.formatted(
                request.getRequesterName(),
                request.getRequesterEmail(),
                messageText,
                timestamp,
                adminLink
        );
    }

    private String buildRequesterApprovalEmailBody(
            LocationAccessRequestEntity request,
            String plainToken,
            Instant expiresAt
    ) {
        String expirationText = expiresAt == null
                ? "This access remains valid until revoked."
                : "This access expires at " + TIMESTAMP_FORMATTER.format(expiresAt) + ".";

        return """
                Your location access request was approved.

                Name: %s
                Email: %s

                Use this private access link:
                %s

                %s

                Keep this link private. It does not share any location coordinates by itself.
                """.formatted(
                request.getRequesterName(),
                request.getRequesterEmail(),
                buildRequesterAccessLink(plainToken),
                expirationText
        );
    }

    private String buildAdminLink(String requestId) {
        if (adminPageUrl.isBlank()) {
            return "Admin page URL is not configured. Set LOCATION_ACCESS_ADMIN_PAGE_URL.";
        }

        String separator = adminPageUrl.contains("?") ? "&" : "?";
        return adminPageUrl + separator + "requestId=" + requestId;
    }

    private String buildRequesterAccessLink(String plainToken) {
        if (requesterPageUrl.isBlank()) {
            return "Requester page URL is not configured. Set LOCATION_ACCESS_REQUESTER_PAGE_URL.";
        }

        String separator = requesterPageUrl.contains("?") ? "&" : "?";
        return requesterPageUrl + separator + "token=" + plainToken;
    }
}
