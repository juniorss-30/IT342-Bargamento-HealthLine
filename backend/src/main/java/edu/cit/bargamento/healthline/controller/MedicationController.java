package edu.cit.bargamento.healthline.controller;

import edu.cit.bargamento.healthline.entity.Medication;
import edu.cit.bargamento.healthline.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/medications")
// 🚀 FIXED: Open the CrossOrigin bounds to cleanly receive incoming mobile layouts
@CrossOrigin(origins = {"http://localhost:3000", "http://10.0.2.2:8080"}, allowedHeaders = "*", allowCredentials = "true")
public class MedicationController {

    @Autowired
    private MedicationRepository repository;

    @PostMapping
    public Medication save(@RequestBody Medication m) {
        return repository.save(m);
    }

    @GetMapping
    // 🚀 FIXED: Added required = false so that if a request comes in, it safely checks instead of throwing a 403
    public List<Medication> getByEmail(@RequestParam(required = false) String email) {
        if (email == null || email.trim().isEmpty()) {
            return repository.findAll(); // Fallback to avoid breaking empty initial listings
        }
        return repository.findByPatientEmail(email);
    }
}