package com.ileanat.portfolio.entity;

import com.ileanat.portfolio.model.LocationAccessStatus;
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
@Table(name = "location_access_requests")
public class LocationAccessRequestEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 100)
    private String requesterName;

    @Column(nullable = false, length = 254)
    private String requesterEmail;

    @Column(length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LocationAccessStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant expiresAt;

    @Column(length = 128)
    private String accessTokenHash;

    protected LocationAccessRequestEntity() {}

    public LocationAccessRequestEntity(
            String requesterName,
            String requesterEmail,
            String message
    ) {
        this.id = UUID.randomUUID();
        this.requesterName = requesterName;
        this.requesterEmail = requesterEmail;
        this.message = message;
        this.status = LocationAccessStatus.PENDING;
        this.createdAt = Instant.now();
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (status == null) {
            status = LocationAccessStatus.PENDING;
        }
    }

    public UUID getId() {
        return id;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public String getMessage() {
        return message;
    }

    public LocationAccessStatus getStatus() {
        return status;
    }

    public void setStatus(LocationAccessStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getAccessTokenHash() {
        return accessTokenHash;
    }

    public void setAccessTokenHash(String accessTokenHash) {
        this.accessTokenHash = accessTokenHash;
    }
}
