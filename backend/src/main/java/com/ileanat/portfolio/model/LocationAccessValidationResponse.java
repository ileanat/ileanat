package com.ileanat.portfolio.model;

import java.time.Instant;

public record LocationAccessValidationResponse(
        boolean approved,
        LocationAccessStatus status,
        Instant expiresAt
) {}
