package edu.cit.bargamento.healthline.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Matches SDD Section 3.2
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disabled for development/API testing
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new CorsConfiguration();
                    // Allows your React app to communicate with the backend
                    config.setAllowedOrigins(List.of("http://localhost:3000"));
                    config.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE"));
                    config.setAllowedHeaders(List.of("*"));
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // Permit the consultation endpoints so you can demo the main feature
                        .requestMatchers("/api/v1/consultations", "/api/v1/consultations/**").permitAll()
                        .requestMatchers("/api/v1/medications", "/api/v1/medications/**", "/api/v1/schedules/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}