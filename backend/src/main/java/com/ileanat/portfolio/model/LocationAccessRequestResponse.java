package com.ileanat.portfolio.model;

import java.time.Instant;

public record LocationAccessRequestResponse(
        String id,
        String name,
        String email,
        String message,
        LocationAccessStatus status,
        Instant createdAt,
        Instant expiresAt
) {}
