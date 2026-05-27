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
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new CorsConfiguration();
                    // Add your React frontend AND allow wildcard origins for mobile testing
                    config.setAllowedOrigins(List.of("http://localhost:3000", "http://10.0.2.2", "http://12.0.0.1"));
                    config.setAllowedOriginPatterns(List.of("*")); // Allows emulators/mobile wrappers to connect seamlessly
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/consultations", "/api/v1/consultations/**").permitAll()
                        .requestMatchers("/api/v1/medications", "/api/v1/medications/**").permitAll()
                        .requestMatchers("/api/v1/schedules", "/api/v1/schedules/**").permitAll()
                        .requestMatchers("/api/v1/users", "/api/v1/users/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}   