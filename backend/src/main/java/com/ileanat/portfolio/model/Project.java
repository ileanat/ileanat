package com.ileanat.portfolio.model;

import java.util.List;

public record Project(
        String title,
        String description,
        List<String> tags,
        String github,
        String demo
) {}
