package edu.uscb.csci470sp26.servexa_backend.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort; // needed for sorting list of users by ID
import org.springframework.web.bind.annotation.*;

import edu.uscb.csci470sp26.servexa_backend.exception.VendorNotFoundException;
import edu.uscb.csci470sp26.servexa_backend.model.Vendor;
import edu.uscb.csci470sp26.servexa_backend.repository.VendorRepository;

@RestController
public class VendorController {

    @Autowired
    private VendorRepository vendorRepository;

    //Posting map for adding a new vendor
    @PostMapping("/vendor")
    Vendor newVendor(@RequestBody Vendor newVendor) {
        //throw new UnsupportedOperationException("Creating new Vendor is not supported yet.");
    	return vendorRepository.save(newVendor);
    }

    //Get mapping for fetching all vendors
    @GetMapping("/vendor")
    List<Vendor> getAllVendors() {
  	  	//return Collections.emptyList(); // Return an empty list for now, as fetching all Vendors is not supported yet.
    	return vendorRepository.findAll(Sort.by(Sort.Direction.ASC, "vendorId"));
    }

	//Get mapping for fetching a vendor by ID
    @GetMapping("/vendor/{id}")
    Vendor getVendorById(@PathVariable Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new VendorNotFoundException(id));
    }

    //Put mapping for updating a vendor by ID
    @PutMapping("/vendor/{id}")
    Vendor updateVendor(@RequestBody Vendor newVendor, @PathVariable Long id) {
        return vendorRepository.findById(id)
                .map(vendor -> {
                    vendor.setName(newVendor.getName());
                    vendor.setServiceType(newVendor.getServiceType());
                    vendor.setAddressLine1(newVendor.getAddressLine1());
                    vendor.setAddressLine2(newVendor.getAddressLine2());
                    vendor.setAddressCity(newVendor.getAddressCity());
                    vendor.setAddressZip(newVendor.getAddressZip());
                    vendor.setContactFirstName(newVendor.getContactFirstName());
                    vendor.setContactLastName(newVendor.getContactLastName());
                    vendor.setPhone(newVendor.getPhone());
                    vendor.setEmail(newVendor.getEmail());
                    return vendorRepository.save(vendor);
                })
                .orElseThrow(() -> new VendorNotFoundException(id));
    }

    @DeleteMapping("/vendor/{id}")
    String deleteVendor(@PathVariable Long id) {
        if (!vendorRepository.existsById(id)) {
            throw new VendorNotFoundException(id);
        }
        vendorRepository.deleteById(id);
        return "Vendor with id " + id + " has been deleted successfully.";
    }

} // end class VendorController