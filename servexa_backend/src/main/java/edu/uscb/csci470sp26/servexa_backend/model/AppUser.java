package edu.uscb.csci470sp26.servexa_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "USER" or "ADMIN"

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tenant_id", nullable = true, unique = true)
    private Tenant tenant;

    // ✅ Default constructor (required by JPA)
    public AppUser() {}

    // ✅ Constructor with fields
    public AppUser(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // ✅ Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    // ✅ Setters (if needed)
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }
    
    public Tenant getTenant() {
		return tenant;
	}
   
    public void setTenant(Tenant tenant) {
    				this.tenant = tenant;
    	}

    // ✅ Useful for debugging
    @Override
    public String toString() {
        return "AppUser{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
