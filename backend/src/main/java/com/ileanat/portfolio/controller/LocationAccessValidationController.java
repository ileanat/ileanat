package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.model.LocationAccessValidationResponse;
import com.ileanat.portfolio.service.LocationAccessRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/location-access")
public class LocationAccessValidationController {

    private static final Logger log = LoggerFactory.getLogger(LocationAccessValidationController.class);

    private final LocationAccessRequestService locationAccessRequestService;

    public LocationAccessValidationController(LocationAccessRequestService locationAccessRequestService) {
        this.locationAccessRequestService = locationAccessRequestService;
    }

    @GetMapping("/validate")
    public LocationAccessValidationResponse validateAccess(@RequestParam("token") String token) {
        log.info("GET /api/location-access/validate received");
        return locationAccessRequestService.validateAccess(token);
    }
}
