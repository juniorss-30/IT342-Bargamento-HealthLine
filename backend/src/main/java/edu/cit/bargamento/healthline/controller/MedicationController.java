package edu.cit.bargamento.healthline.controller;

import edu.cit.bargamento.healthline.entity.Medication;
import edu.cit.bargamento.healthline.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/medications")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicationController {

    @Autowired
    private MedicationRepository repository;

    @PostMapping
    public Medication save(@RequestBody Medication m) {
        return repository.save(m);
    }

    @GetMapping
    public List<Medication> getByEmail(@RequestParam String email) {
        return repository.findByPatientEmail(email);
    }
}