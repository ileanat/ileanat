package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.model.CreateLocationAccessRequest;
import com.ileanat.portfolio.model.SubmitLocationAccessResponse;
import com.ileanat.portfolio.service.LocationAccessRequestService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/location-access")
public class LocationAccessRequestController {

    private static final Logger log = LoggerFactory.getLogger(LocationAccessRequestController.class);

    private final LocationAccessRequestService locationAccessRequestService;

    public LocationAccessRequestController(LocationAccessRequestService locationAccessRequestService) {
        this.locationAccessRequestService = locationAccessRequestService;
    }

    @PostMapping("/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public SubmitLocationAccessResponse submitRequest(@Valid @RequestBody CreateLocationAccessRequest request) {
        log.info("POST /api/location-access/requests received for {}", request.email());
        return locationAccessRequestService.submitRequest(request);
    }
}
