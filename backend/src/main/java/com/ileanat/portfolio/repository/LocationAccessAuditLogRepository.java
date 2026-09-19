package com.ileanat.portfolio.repository;

import com.ileanat.portfolio.entity.LocationAccessAuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LocationAccessAuditLogRepository extends JpaRepository<LocationAccessAuditLogEntity, UUID> {}
