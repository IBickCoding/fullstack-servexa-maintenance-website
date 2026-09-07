package edu.uscb.csci470sp26.servexa_backend.controller;

public class AuthRequest {
    private String email;
    private String password;
    private String role;
    private Long tenantId;

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public Long getTenantId() { return tenantId; }
    
}
