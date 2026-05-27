package edu.cit.bargamento.healthline.controller;

import edu.cit.bargamento.healthline.entity.User;
import edu.cit.bargamento.healthline.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PutMapping("/{email:.+}")
    public User updateProfile(@PathVariable String email, @RequestBody User userDetails) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDetails.getFullName() != null) {
            user.setFullName(userDetails.getFullName());
        }
        return userRepository.save(user);
    }

    @PutMapping("/{email:.+}/password")
    public User changePassword(@PathVariable String email, @RequestBody Map<String, String> passwords) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentPassword = passwords.get("currentPassword");
        String newPassword = passwords.get("newPassword");

        // Use BCryptPasswordEncoder to match hashed password
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
}