package edu.cit.bargamento.healthline.controller;

import edu.cit.bargamento.healthline.entity.Consultation;
import edu.cit.bargamento.healthline.repository.ConsultationRepository;
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

    @PatchMapping("/{id}/status") // Status Update
    public Consultation updateStatus(@PathVariable Long id, @RequestBody String status) {
        Consultation c = repository.findById(id).orElseThrow();
        c.setStatus(status.replace("\"", ""));
        return repository.save(c);
    }
}