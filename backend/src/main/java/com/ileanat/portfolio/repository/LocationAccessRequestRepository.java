package com.ileanat.portfolio.repository;

import com.ileanat.portfolio.entity.LocationAccessRequestEntity;
import com.ileanat.portfolio.model.LocationAccessStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LocationAccessRequestRepository extends JpaRepository<LocationAccessRequestEntity, UUID> {

    List<LocationAccessRequestEntity> findAllByOrderByCreatedAtDesc();

    List<LocationAccessRequestEntity> findByStatusOrderByCreatedAtDesc(LocationAccessStatus status);

    Optional<LocationAccessRequestEntity> findByAccessTokenHash(String accessTokenHash);
}
