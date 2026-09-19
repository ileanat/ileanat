package com.ileanat.portfolio.entity;

import com.ileanat.portfolio.model.LocationAccessAuditEvent;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "location_access_audit_logs")
public class LocationAccessAuditLogEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID requestId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private LocationAccessAuditEvent eventType;

    @Column(length = 500)
    private String details;

    @Column(nullable = false)
    private Instant createdAt;

    protected LocationAccessAuditLogEntity() {}

    public LocationAccessAuditLogEntity(UUID requestId, LocationAccessAuditEvent eventType, String details) {
        this.id = UUID.randomUUID();
        this.requestId = requestId;
        this.eventType = eventType;
        this.details = details;
        this.createdAt = Instant.now();
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public UUID getRequestId() {
        return requestId;
    }

    public LocationAccessAuditEvent getEventType() {
        return eventType;
    }

    public String getDetails() {
        return details;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
