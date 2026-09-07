package edu.uscb.csci470sp26.servexa_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort; // needed for sorting list of users by ID
import org.springframework.web.bind.annotation.*;

import edu.uscb.csci470sp26.servexa_backend.model.Tenant;
import edu.uscb.csci470sp26.servexa_backend.repository.TenantRepository;

@RestController
public class TenantController {

    @Autowired
    private TenantRepository TenantRepository;

   //Posting map for adding a new tenant
    @PostMapping("/tenant")
    Tenant newTenant(@RequestBody Tenant newTenant) {
        //throw new UnsupportedOperationException("Creating new Tenant is not supported yet.");
    	return TenantRepository.save(newTenant);
    }

   //Get mapping for fetching all tenants
    @GetMapping("/tenant")
    List<Tenant> getAllTenant() {
    	//return Collections.emptyList(); // Return an empty list for now, as fetching all Tenants is not supported yet.
    	// Sort by the tenant id
    	return TenantRepository.findAll(Sort.by(Sort.Direction.ASC, "tenantId"));
    }

	//Get mapping for fetching a tenant by ID
    @GetMapping("/tenant/{id}")
    Tenant getTenantById(@PathVariable Long id) {
    	// Avoid throwing a custom exception here so tests don't depend on it.
    	// Return null if not found (controller will serialize appropriately), or the found entity.
    	return TenantRepository.findById(id).orElse(null);
    }

	//Put mapping for updating a tenant by ID
    @PutMapping("/tenant/{id}")
    Tenant updateServiceRequest(@RequestBody Tenant newTenant, @PathVariable Long id) {
    	// If tenant exists, update; otherwise create a new tenant with the provided id.
    	return TenantRepository.findById(id)
                .map(Tenant -> {
                    Tenant.setEmail(newTenant.getEmail());
                    Tenant.setFirstName(newTenant.getFirstName());
                    Tenant.setLastName(newTenant.getLastName());
                    Tenant.setPhone(newTenant.getPhone());
                    Tenant.setUnitNumber(newTenant.getUnitNumber());
                    return TenantRepository.save(Tenant);
                })
                .orElseGet(() -> {
                    newTenant.setTenantId(id);
                    return TenantRepository.save(newTenant);
                });
    }

     //Delete mapping for deleting a tenant by ID
    @DeleteMapping("/tenant/{id}")
    String deleteServiceRequest(@PathVariable Long id) {
    	if(!TenantRepository.existsById(id)) {
            return "Tenant with id " + id + " does not exist.";
        }
        TenantRepository.deleteById(id);
    	return "Tenant with id " + id + " has been deleted successfully.";
    }

} // end class TenantController