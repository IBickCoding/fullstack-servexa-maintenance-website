package edu.uscb.csci470sp26.servexa_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name="serviceRequests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;
    
    // Many to one relationship because there can be a ton of requests having a relationship with one user but each request should be submitted by only one user.
    // Joins tenant table to the requests table via the userID.
    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;
    
    // Many to one relationship because vendors can be assigned to many requests but each request should only have one vendor.
    // I understand that requests will originally have no vendor assigned to the request, this will still work. The id will just be null and it will say null.
    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    private String status;
    private String urgency;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM/dd/yyyy")
    private LocalDate submissionDate;

    private String description;
    private String division;
    
    // All the public setters and getters for the above values stored in the database.
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    // expose id as "id" in JSON for tests
    @JsonProperty("id")
    public Long getId() {
        return requestId;
    }

    // expose id as "serviceRequestId" in JSON for tests
    @JsonProperty("serviceRequestId")
    public Long getServiceRequestId() {
        return requestId;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public Vendor getVendor() {
        return vendor;
    }

    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public LocalDate getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDate submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }
}