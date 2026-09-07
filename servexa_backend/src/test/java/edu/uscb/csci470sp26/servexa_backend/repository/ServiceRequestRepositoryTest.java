
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

import edu.uscb.csci470sp26.servexa_backend.model.ServiceRequest;

@ExtendWith(SpringExtension.class)
@DataJpaTest
public class ServiceRequestRepositoryTest {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Test
    public void testFindById() {
        // Arrange
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setStatus("Open");
        serviceRequest = serviceRequestRepository.save(serviceRequest);

        // Act
        Optional<ServiceRequest> foundServiceRequest = serviceRequestRepository.findById(serviceRequest.getRequestId());

        // Assert
        assertTrue(foundServiceRequest.isPresent());
        assertEquals("Open", foundServiceRequest.get().getStatus());
    }

    @Test
    public void testSave() {
        // Arrange
    	ServiceRequest serviceRequest = new ServiceRequest();
    	serviceRequest.setStatus("Open");

        // Act
        ServiceRequest savedServiceRequest = serviceRequestRepository.save(serviceRequest);

        // Assert
        assertEquals("Open", savedServiceRequest.getStatus());
        assertTrue(serviceRequestRepository.findById(savedServiceRequest.getRequestId()).isPresent());
    }

    @Test
    public void testDeleteById() {
        // Arrange
    	ServiceRequest serviceRequest = new ServiceRequest();
    	serviceRequest.setStatus("Open");
    	serviceRequest = serviceRequestRepository.save(serviceRequest);
        Long userId = serviceRequest.getRequestId();

        // Act
        serviceRequestRepository.deleteById(userId);

        // Assert
        assertFalse(serviceRequestRepository.findById(userId).isPresent());
    }
}