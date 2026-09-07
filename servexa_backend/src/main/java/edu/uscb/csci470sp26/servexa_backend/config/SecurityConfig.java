package edu.uscb.csci470sp26.servexa_backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.uscb.csci470sp26.servexa_backend.security.JwtAuthenticationFilter;
import edu.uscb.csci470sp26.servexa_backend.security.JwtAuthEntryPoint;
import edu.uscb.csci470sp26.servexa_backend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    public SecurityConfig(JwtUtil jwtUtil, JwtAuthEntryPoint jwtAuthEntryPoint) {
        this.jwtUtil = jwtUtil;
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                
            	.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            		
            	// Login and Registering section
            	//.requestMatchers("/auth/register").permitAll()
                .requestMatchers("/auth/register").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                .requestMatchers("/auth/login").permitAll()
                
                //  Vendor section
                //.requestMatchers(HttpMethod.GET, "/vendor").permitAll()
                .requestMatchers(HttpMethod.GET, "/vendor").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                //.requestMatchers(HttpMethod.GET, "/vendor/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/vendor/{id}").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                //.requestMatchers(HttpMethod.POST, "/vendor").permitAll()
                .requestMatchers(HttpMethod.POST, "/vendor").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                //.requestMatchers(HttpMethod.PUT, "/vendor/{id}").permitAll()
                .requestMatchers(HttpMethod.PUT, "/vendor/{id}").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                //.requestMatchers(HttpMethod.DELETE, "/vendor/{id}").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/vendor/{id}").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                
                // Tenant section
                //.requestMatchers(HttpMethod.GET, "/tenant").permitAll()
                .requestMatchers(HttpMethod.GET, "/tenant").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                //.requestMatchers(HttpMethod.GET, "/tenant/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/tenant/{id}").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                //.requestMatchers(HttpMethod.POST, "/tenant").permitAll()
                .requestMatchers(HttpMethod.POST, "/tenant").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                //.requestMatchers(HttpMethod.PUT, "/tenant/{id}").permitAll()
                .requestMatchers(HttpMethod.PUT, "/tenant/{id}").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                //.requestMatchers(HttpMethod.DELETE, "/tenant/{id}").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/tenant/{id}").hasAnyAuthority("ADMIN", "PRIVILEGED_USER")
                
                // Service Request section
                .requestMatchers(HttpMethod.GET, "/service-request").permitAll()
                .requestMatchers(HttpMethod.GET, "/service-request/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/service-request").permitAll()
                .requestMatchers(HttpMethod.PUT, "/service-request/{id}").permitAll()
                //.requestMatchers(HttpMethod.DELETE, "/service-request/{id}").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/service-request/{id}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/service-request/my-requests/{tenantId}").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthEntryPoint)
                .accessDeniedHandler(accessDeniedHandler()))
            .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Allowed frontend origins
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "https://servexa-team3.netlify.app" // <-- IMPORTANT! Update this URL when you deploy frontend to Netlify
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (HttpServletRequest request, HttpServletResponse response, AccessDeniedException ex) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);

            Map<String, Object> error = new HashMap<>();
            error.put("status", 403);
            error.put("error", "Forbidden");
            error.put("message", "Access denied: Insufficient permissions");
            error.put("path", request.getRequestURI());

            new ObjectMapper().writeValue(response.getWriter(), error);
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
