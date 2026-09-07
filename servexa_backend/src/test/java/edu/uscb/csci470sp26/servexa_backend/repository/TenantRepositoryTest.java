
package edu.uscb.csci470sp26.servexa_backend.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional; // Optional is used to avoid NullPointerExceptions

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import edu.uscb.csci470sp26.servexa_backend.model.Tenant;

@ExtendWith(SpringExtension.class)
@DataJpaTest
public class TenantRepositoryTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Test
    public void testFindById() {
        // Arrange
    	Tenant tenant = new Tenant();
    	tenant.setFirstName("John Doe");
    	tenant = tenantRepository.save(tenant);

        // Act
        Optional<Tenant> foundTenant = tenantRepository.findById(tenant.getTenantId());

        // Assert
        assertTrue(foundTenant.isPresent());
        assertEquals("John Doe", foundTenant.get().getFirstName());
    }

    @Test
    public void testSave() {
        // Arrange
    	Tenant tenant = new Tenant();
    	tenant.setFirstName("Jane Doe");

        // Act
    	Tenant savedTenant = tenantRepository.save(tenant);

        // Assert
        assertEquals("Jane Doe", savedTenant.getFirstName());
        assertTrue(tenantRepository.findById(savedTenant.getTenantId()).isPresent());
    }

    @Test
    public void testDeleteById() {
        // Arrange
    	Tenant tenant = new Tenant();
    	tenant.setFirstName("John Smith");
    	tenant = tenantRepository.save(tenant);
        Long userId = tenant.getTenantId();

        // Act
        tenantRepository.deleteById(userId);

        // Assert
        assertFalse(tenantRepository.findById(userId).isPresent());
    }
}