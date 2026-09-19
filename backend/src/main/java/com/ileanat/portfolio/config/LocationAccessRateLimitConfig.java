package com.ileanat.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class LocationAccessRateLimitConfig implements WebMvcConfigurer {

    private final LocationAccessRateLimitInterceptor rateLimitInterceptor;

    public LocationAccessRateLimitConfig(LocationAccessRateLimitInterceptor rateLimitInterceptor) {
        this.rateLimitInterceptor = rateLimitInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitInterceptor)
                .addPathPatterns(
                        "/api/location-access/requests",
                        "/api/location-access/validate"
                );
    }
}
