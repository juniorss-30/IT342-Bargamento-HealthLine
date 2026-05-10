package edu.cit.bargamento.healthline.features.consultation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/consultations")
@CrossOrigin(origins = "http://localhost:3000")
public class ConsultationController {

    @Autowired
    private ConsultationRepository repository;

    @PostMapping // Journey 1: Patient Submission
    public Consultation submit(@RequestBody Consultation c) {
        c.setStatus("PENDING");
        c.setCreatedAt(LocalDateTime.now());
        return repository.save(c);
    }

    @GetMapping // Journey 2: Doctor View
    public List<Consultation> getAll() {
        return repository.findAll();
    }

    @PutMapping("/{id}")
    public Consultation updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> updates) {
        Consultation c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        if (updates.containsKey("status")) {
            c.setStatus(updates.get("status"));
        }

        return repository.save(c);
    }
}