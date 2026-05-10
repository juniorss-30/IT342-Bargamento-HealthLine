package edu.cit.bargamento.healthline.features.auth;

import edu.cit.bargamento.healthline.features.auth.User;
import edu.cit.bargamento.healthline.features.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired private UserRepository userRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    public User register(User user) throws Exception {
        // 1. Check for duplicate email
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        // 2. Encode password (bridge between frontend 'password' and 'passwordHash')
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        // 3. Set default role to PATIENT if none is provided
        if (user.getRole() == null) {
            user.setRole(User.Role.PATIENT);
        }

        return userRepository.save(user);
    }

    public Optional<User> login(String email, String rawPassword) {
        // Find user by email and verify the BCrypt hash
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()));
    }
}