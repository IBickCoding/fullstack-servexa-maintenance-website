package edu.uscb.csci470sp26.servexa_backend.service;

import edu.uscb.csci470sp26.servexa_backend.model.AppUser;
import edu.uscb.csci470sp26.servexa_backend.model.Tenant;
import edu.uscb.csci470sp26.servexa_backend.repository.TenantRepository;
import edu.uscb.csci470sp26.servexa_backend.repository.AppUserRepository;
import edu.uscb.csci470sp26.servexa_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private TenantRepository tenantRepository;

    /**
     * Registers a new user by encoding their password and saving them to the database.
     */
    public String registerUser(String email, String password, String role, Long tenantId) {
        // ✅ Check if user already exists
        if (appUserRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists.");
        }

        // ✅ Encode password before saving user
        String hashedPassword = passwordEncoder.encode(password);
        AppUser newUser = new AppUser(email, hashedPassword, role);
        
        // ✅ If tenantId is provided, map tenantId to the tenant and make sure it exists before saving the user.
        if (tenantId != null) {
            Tenant tenant = tenantRepository.findById(tenantId)
                    .orElseThrow(() -> new RuntimeException("Tenant not found"));
  
            newUser.setTenant(tenant);
        }
        
        appUserRepository.save(newUser);

        return "User registered successfully";
    }

    /**
     * Authenticates a user by verifying their email and password, then generating a JWT token.
     */
    public String authenticateUser(String email, String password) {
        // ✅ Find user by email
        Optional<AppUser> appUserOptional = appUserRepository.findByEmail(email);
        if (appUserOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password.");
        }

        AppUser appUser = appUserOptional.get();

        // ✅ Verify password
        if (!passwordEncoder.matches(password, appUser.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        // ✅ Generate JWT token using JwtUtil
        return jwtUtil.generateToken(appUser.getEmail(), appUser.getRole(), appUser.getTenant() != null ? appUser.getTenant().getTenantId() : null);
    }
}
