package edu.uscb.csci470sp26.servexa_backend.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort; // needed for sorting list of users by ID
import org.springframework.web.bind.annotation.*;

import edu.uscb.csci470sp26.servexa_backend.exception.ServiceRequestNotFoundException;
import edu.uscb.csci470sp26.servexa_backend.model.ServiceRequest;
import edu.uscb.csci470sp26.servexa_backend.repository.ServiceRequestRepository;

@RestController
public class ServiceRequestController {

    @Autowired
    private ServiceRequestRepository ServiceRequestRepository;

    //Posting map for adding a new request
    @PostMapping("/service-request")
    ServiceRequest newServiceRequest(@RequestBody ServiceRequest newServiceRequest) {
        //throw new UnsupportedOperationException("Creating new ServiceRequest is not supported yet.");
    	return ServiceRequestRepository.save(newServiceRequest);
    }

    //Get mapping for fetching all requests
    @GetMapping("/service-request")
    List<ServiceRequest> getAllServiceRequest() {
  	  //return Collections.emptyList(); // Return an empty list for now, as fetching all ServiceRequests is not supported yet.
    	return ServiceRequestRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    //Get mapping for fetching a request by ID
    @GetMapping("/service-request/{id}")
    ServiceRequest getServiceRequestById(@PathVariable Long id) {
      //throw new UnsupportedOperationException("Fetching ServiceRequest by ID is not supported yet.");
    	return ServiceRequestRepository.findById(id)
			  .orElseThrow(() -> new ServiceRequestNotFoundException(id));
    }
    
    @GetMapping("/service-request/my-requests/{tenantId}")
    List<ServiceRequest> getServiceRequestByTenantId(@PathVariable Long tenantId) {
		//throw new UnsupportedOperationException("Fetching ServiceRequests by tenant is not supported yet.");
		return ServiceRequestRepository.findByTenant_TenantId(tenantId);
	}
    
    
    //Put mapping for updating a request by ID
    @PutMapping({"/service-request/{id}"})
    ServiceRequest updateServiceRequest(@RequestBody ServiceRequest newServiceRequest, @PathVariable Long id) {
        //throw new UnsupportedOperationException("Updating ServiceRequest is not supported yet.");
    	return ServiceRequestRepository.findById(id)
				.map(ServiceRequest -> {
					ServiceRequest.setTenant(newServiceRequest.getTenant());
		            ServiceRequest.setVendor(newServiceRequest.getVendor());
					ServiceRequest.setStatus(newServiceRequest.getStatus());
					ServiceRequest.setUrgency(newServiceRequest.getUrgency());
					ServiceRequest.setSubmissionDate(newServiceRequest.getSubmissionDate());
        			ServiceRequest.setDivision(newServiceRequest.getDivision());
        			ServiceRequest.setDescription(newServiceRequest.getDescription());
					return ServiceRequestRepository.save(ServiceRequest);
				})
				
				
				.orElseThrow(() -> new ServiceRequestNotFoundException(id));
    }

    //Delete mapping for deleting a request by ID
    @DeleteMapping("/service-request/{id}")
    String deleteServiceRequest(@PathVariable Long id) {
        //throw new ServiceRequestNotFoundException(id); // Deleting ServiceRequest is not supported yet, so we throw an exception to indicate that the ServiceRequest with the given ID was not found.
    	if(!ServiceRequestRepository.existsById(id)) {
			throw new ServiceRequestNotFoundException(id);
		}
        ServiceRequestRepository.deleteById(id);
		return "ServiceRequest with id " + id + " has been deleted successfully.";
    }

} // end class ServiceRequestController