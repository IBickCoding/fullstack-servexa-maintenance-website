
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

import edu.uscb.csci470sp26.servexa_backend.model.Vendor;

@ExtendWith(SpringExtension.class)
@DataJpaTest
public class VendorRepositoryTest {

    @Autowired
    private VendorRepository vendorRepository;

    @Test
    public void testFindById() {
        // Arrange
    	Vendor vendor = new Vendor();
    	vendor.setName("John Doe");
    	vendor = vendorRepository.save(vendor);

        // Act
        Optional<Vendor> foundServiceRequest = vendorRepository.findById(vendor.getVendorId());

        // Assert
        assertTrue(foundServiceRequest.isPresent());
        assertEquals("John Doe", foundServiceRequest.get().getName());
    }

    @Test
    public void testSave() {
        // Arrange
    	Vendor vendor = new Vendor();
    	vendor.setName("Jane Doe");

        // Act
    	Vendor savedServiceRequest = vendorRepository.save(vendor);

        // Assert
        assertEquals("Jane Doe", savedServiceRequest.getName());
        assertTrue(vendorRepository.findById(savedServiceRequest.getVendorId()).isPresent());
    }

    @Test
    public void testDeleteById() {
        // Arrange
    	Vendor vendor = new Vendor();
    	vendor.setName("John Smith");
    	vendor = vendorRepository.save(vendor);
        Long userId = vendor.getVendorId();

        // Act
        vendorRepository.deleteById(userId);

        // Assert
        assertFalse(vendorRepository.findById(userId).isPresent());
    }
}