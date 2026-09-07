package edu.uscb.csci470sp26.servexa_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.uscb.csci470sp26.servexa_backend.model.Tenant;

public interface TenantRepository extends JpaRepository<Tenant, Long> {

}
