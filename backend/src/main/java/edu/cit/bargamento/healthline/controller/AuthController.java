@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin("*")
public class AuthController {
    @Autowired private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User data = authService.register(user);
            // Structural: DTO Pattern - Mask sensitive data
            UserDTO response = convertToDTO(data);
            return ResponseEntity.ok(createResponse(true, response, null));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(createResponse(false, null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        return authService.login(req.get("email"), req.get("password"))
                .map(u -> ResponseEntity.ok(createResponse(true, convertToDTO(u), null)))
                .orElse(ResponseEntity.status(401).body(createResponse(false, null, "Invalid Credentials")));
    }

    // Helper for DTO mapping
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().toString(),
                user.getLicenseNumber()
        );
    }

    private Map<String, Object> createResponse(boolean success, Object data, Object error) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", success);
        resp.put("data", data); // Now returns clean DTO
        resp.put("error", error);
        resp.put("timestamp", java.time.LocalDateTime.now().toString());
        return resp;
    }
}