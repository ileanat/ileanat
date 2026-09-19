package com.ileanat.portfolio.service;

import com.ileanat.portfolio.entity.LocationAccessAuditLogEntity;
import com.ileanat.portfolio.model.LocationAccessAuditEvent;
import com.ileanat.portfolio.repository.LocationAccessAuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class LocationAccessAuditService {

    private static final Logger log = LoggerFactory.getLogger(LocationAccessAuditService.class);

    private final LocationAccessAuditLogRepository auditLogRepository;

    public LocationAccessAuditService(LocationAccessAuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(UUID requestId, LocationAccessAuditEvent eventType, String details) {
        auditLogRepository.save(new LocationAccessAuditLogEntity(requestId, eventType, details));
        log.info(
                "Location access audit event={} requestId={} details={}",
                eventType,
                requestId,
                details == null ? "" : details
        );
    }
}
