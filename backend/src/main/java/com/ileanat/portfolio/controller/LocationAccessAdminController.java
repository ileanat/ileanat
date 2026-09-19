package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.model.ApproveLocationAccessRequest;
import com.ileanat.portfolio.model.LocationAccessRequestResponse;
import com.ileanat.portfolio.service.LocationAccessRequestService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/location-access/admin")
public class LocationAccessAdminController {

    private static final Logger log = LoggerFactory.getLogger(LocationAccessAdminController.class);

    private final LocationAccessRequestService locationAccessRequestService;

    public LocationAccessAdminController(LocationAccessRequestService locationAccessRequestService) {
        this.locationAccessRequestService = locationAccessRequestService;
    }

    @GetMapping("/requests")
    public List<LocationAccessRequestResponse> getAllRequests() {
        log.info("GET /api/location-access/admin/requests received");
        return locationAccessRequestService.findAllRequests();
    }

    @GetMapping("/requests/pending")
    public List<LocationAccessRequestResponse> getPendingRequests() {
        log.info("GET /api/location-access/admin/requests/pending received");
        return locationAccessRequestService.findPendingRequests();
    }

    @PostMapping("/requests/{id}/approve")
    public LocationAccessRequestResponse approveRequest(
            @PathVariable String id,
            @Valid @RequestBody ApproveLocationAccessRequest approval
    ) {
        log.info(
                "POST /api/location-access/admin/requests/{}/approve received for {} minutes",
                id,
                approval.durationMinutes()
        );
        return locationAccessRequestService.approveRequest(id, approval);
    }

    @PostMapping("/requests/{id}/deny")
    public LocationAccessRequestResponse denyRequest(@PathVariable String id) {
        log.info("POST /api/location-access/admin/requests/{}/deny received", id);
        return locationAccessRequestService.denyRequest(id);
    }

    @PostMapping("/requests/{id}/revoke")
    public LocationAccessRequestResponse revokeRequest(@PathVariable String id) {
        log.info("POST /api/location-access/admin/requests/{}/revoke received", id);
        return locationAccessRequestService.revokeRequest(id);
    }
}
