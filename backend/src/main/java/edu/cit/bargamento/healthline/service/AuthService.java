@Service // Singleton: Managed as a single instance by Spring
public class AuthService {
    @Autowired private UserRepository userRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    // Behavioral: Strategy - Role-based validation logic
    public User register(User user) throws Exception {
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        // Strategy/Factory logic: Validate based on role
        if ("DOCTOR".equals(user.getRole().toString())) {
            if (user.getLicenseNumber() == null || user.getLicenseNumber().isEmpty()) {
                throw new Exception("License number is required for Doctors");
            }
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()));
    }
}