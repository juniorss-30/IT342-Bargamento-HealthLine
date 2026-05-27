    package edu.cit.bargamento.healthline.controller;

    import edu.cit.bargamento.healthline.entity.User;
    import edu.cit.bargamento.healthline.service.AuthService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import java.util.Map;
    import java.util.HashMap;

    @RestController
    @RequestMapping("/api/v1/auth")
    @CrossOrigin("*")
    public class AuthController {
        @Autowired private AuthService authService;

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody User user) {
            try {
                User data = authService.register(user);
                return ResponseEntity.ok(createResponse(true, data, null));
            } catch (Exception e) {
                return ResponseEntity.status(400).body(createResponse(false, null, e.getMessage()));
            }
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
            return authService.login(req.get("email"), req.get("password"))
                    .map(u -> ResponseEntity.ok(createResponse(true, u, null)))
                    .orElse(ResponseEntity.status(401).body(createResponse(false, null, "Invalid Credentials")));
        }

        private Map<String, Object> createResponse(boolean success, Object data, Object error) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", success);
            resp.put("data", data);
            resp.put("error", error);
            resp.put("timestamp", java.time.LocalDateTime.now().toString());
            return resp;


        }
    }