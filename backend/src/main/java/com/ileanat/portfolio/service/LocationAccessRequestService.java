package com.ileanat.portfolio.service;

import com.ileanat.portfolio.entity.LocationAccessRequestEntity;
import com.ileanat.portfolio.exception.LocationAccessRequestException;
import com.ileanat.portfolio.model.ApproveLocationAccessRequest;
import com.ileanat.portfolio.model.CreateLocationAccessRequest;
import com.ileanat.portfolio.model.LocationAccessAuditEvent;
import com.ileanat.portfolio.model.LocationAccessRequestResponse;
import com.ileanat.portfolio.model.LocationAccessStatus;
import com.ileanat.portfolio.model.LocationAccessValidationResponse;
import com.ileanat.portfolio.model.SubmitLocationAccessResponse;
import com.ileanat.portfolio.repository.LocationAccessRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class LocationAccessRequestService {

    private static final Set<Integer> ALLOWED_APPROVAL_MINUTES = Set.of(15, 60, 1440);
    private static final int UNTIL_REVOKED_DURATION = 0;

    private final LocationAccessRequestRepository requestRepository;
    private final LocationAccessNotificationService notificationService;
    private final LocationAccessTokenService tokenService;
    private final LocationAccessAuditService auditService;

    public LocationAccessRequestService(
            LocationAccessRequestRepository requestRepository,
            LocationAccessNotificationService notificationService,
            LocationAccessTokenService tokenService,
            LocationAccessAuditService auditService
    ) {
        this.requestRepository = requestRepository;
        this.notificationService = notificationService;
        this.tokenService = tokenService;
        this.auditService = auditService;
    }

    @Transactional
    public SubmitLocationAccessResponse submitRequest(CreateLocationAccessRequest request) {
        String message = request.message();
        if (message != null && message.isBlank()) {
            message = null;
        }

        LocationAccessRequestEntity entity = requestRepository.save(
                new LocationAccessRequestEntity(
                        request.name().trim(),
                        request.email().trim().toLowerCase(),
                        message
                )
        );

        auditService.log(
                entity.getId(),
                LocationAccessAuditEvent.REQUEST_SUBMITTED,
                "Request submitted by " + entity.getRequesterEmail()
        );

        notificationService.notifyOwnerOfNewRequest(entity);

        return new SubmitLocationAccessResponse(
                entity.getId().toString(),
                "Your location access request was submitted and is pending review."
        );
    }

    @Transactional(readOnly = true)
    public List<LocationAccessRequestResponse> findAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LocationAccessRequestResponse> findPendingRequests() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(LocationAccessStatus.PENDING).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public LocationAccessRequestResponse approveRequest(String id, ApproveLocationAccessRequest approval) {
        validateApprovalDuration(approval.durationMinutes());

        LocationAccessRequestEntity entity = requireEntity(id);
        if (entity.getStatus() != LocationAccessStatus.PENDING) {
            throw new LocationAccessRequestException("Only pending requests can be approved.");
        }

        String plainToken = tokenService.generateToken();
        Instant expiresAt = resolveExpiration(approval.durationMinutes());

        entity.setStatus(LocationAccessStatus.APPROVED);
        entity.setExpiresAt(expiresAt);
        entity.setAccessTokenHash(tokenService.hashToken(plainToken));

        LocationAccessRequestEntity saved = requestRepository.save(entity);

        auditService.log(
                saved.getId(),
                LocationAccessAuditEvent.APPROVED,
                buildApprovalAuditDetails(approval.durationMinutes(), expiresAt)
        );

        notificationService.notifyRequesterOfApproval(saved, plainToken, expiresAt);

        return toResponse(saved);
    }

    @Transactional
    public LocationAccessRequestResponse denyRequest(String id) {
        LocationAccessRequestEntity entity = requireEntity(id);
        if (entity.getStatus() != LocationAccessStatus.PENDING) {
            throw new LocationAccessRequestException("Only pending requests can be denied.");
        }

        entity.setStatus(LocationAccessStatus.DENIED);
        entity.setExpiresAt(null);
        entity.setAccessTokenHash(null);

        LocationAccessRequestEntity saved = requestRepository.save(entity);
        auditService.log(saved.getId(), LocationAccessAuditEvent.DENIED, "Request denied by admin.");

        return toResponse(saved);
    }

    @Transactional
    public LocationAccessRequestResponse revokeRequest(String id) {
        LocationAccessRequestEntity entity = requireEntity(id);
        if (entity.getStatus() != LocationAccessStatus.APPROVED) {
            throw new LocationAccessRequestException("Only approved requests can be revoked.");
        }

        entity.setStatus(LocationAccessStatus.REVOKED);
        entity.setExpiresAt(null);

        LocationAccessRequestEntity saved = requestRepository.save(entity);
        auditService.log(saved.getId(), LocationAccessAuditEvent.REVOKED, "Access revoked by admin.");

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public LocationAccessValidationResponse validateAccess(String token) {
        if (token == null || token.isBlank()) {
            return invalidResponse(null);
        }

        String tokenHash = tokenService.hashToken(token.trim());
        LocationAccessRequestEntity entity = requestRepository.findByAccessTokenHash(tokenHash).orElse(null);

        if (entity == null) {
            return invalidResponse(null);
        }

        if (entity.getStatus() == LocationAccessStatus.DENIED
                || entity.getStatus() == LocationAccessStatus.REVOKED) {
            return new LocationAccessValidationResponse(false, entity.getStatus(), entity.getExpiresAt());
        }

        if (entity.getStatus() != LocationAccessStatus.APPROVED) {
            return new LocationAccessValidationResponse(false, entity.getStatus(), entity.getExpiresAt());
        }

        if (isExpired(entity)) {
            auditService.log(
                    entity.getId(),
                    LocationAccessAuditEvent.EXPIRED_ACCESS_ATTEMPT,
                    "Expired access token validation attempt."
            );
            return new LocationAccessValidationResponse(false, entity.getStatus(), entity.getExpiresAt());
        }

        return new LocationAccessValidationResponse(true, entity.getStatus(), entity.getExpiresAt());
    }

    private LocationAccessRequestEntity requireEntity(String id) {
        try {
            return requestRepository.findById(UUID.fromString(id))
                    .orElseThrow(() -> new LocationAccessRequestException("Location access request not found."));
        } catch (IllegalArgumentException ex) {
            throw new LocationAccessRequestException("Location access request not found.");
        }
    }

    private void validateApprovalDuration(Integer durationMinutes) {
        if (durationMinutes == null) {
            throw new LocationAccessRequestException(
                    "Approval duration must be 15 minutes, 1 hour, 24 hours, or until revoked."
            );
        }

        if (durationMinutes != UNTIL_REVOKED_DURATION && !ALLOWED_APPROVAL_MINUTES.contains(durationMinutes)) {
            throw new LocationAccessRequestException(
                    "Approval duration must be 15 minutes, 1 hour, 24 hours, or until revoked."
            );
        }
    }

    private Instant resolveExpiration(Integer durationMinutes) {
        if (durationMinutes == UNTIL_REVOKED_DURATION) {
            return null;
        }

        return Instant.now().plus(durationMinutes, ChronoUnit.MINUTES);
    }

    private boolean isExpired(LocationAccessRequestEntity entity) {
        Instant expiresAt = entity.getExpiresAt();
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }

    private LocationAccessValidationResponse invalidResponse(LocationAccessStatus status) {
        return new LocationAccessValidationResponse(false, status, null);
    }

    private String buildApprovalAuditDetails(Integer durationMinutes, Instant expiresAt) {
        if (durationMinutes == UNTIL_REVOKED_DURATION) {
            return "Approved until revoked.";
        }

        return "Approved for " + durationMinutes + " minutes. Expires at " + expiresAt + ".";
    }

    private LocationAccessRequestResponse toResponse(LocationAccessRequestEntity entity) {
        return new LocationAccessRequestResponse(
                entity.getId().toString(),
                entity.getRequesterName(),
                entity.getRequesterEmail(),
                entity.getMessage(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getExpiresAt()
        );
    }
}
