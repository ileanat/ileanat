package com.ileanat.portfolio.model;

import jakarta.validation.constraints.NotNull;

public record ApproveLocationAccessRequest(
        @NotNull(message = "Approval duration is required.")
        Integer durationMinutes
) {}
