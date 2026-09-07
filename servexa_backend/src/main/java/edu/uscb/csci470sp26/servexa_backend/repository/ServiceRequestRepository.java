package edu.uscb.csci470sp26.servexa_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.uscb.csci470sp26.servexa_backend.model.ServiceRequest;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
	List<ServiceRequest> findByTenant_TenantId(Long tenantId);
}

