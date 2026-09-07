package edu.uscb.csci470sp26.servexa_backend.repository;

import edu.uscb.csci470sp26.servexa_backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
}
