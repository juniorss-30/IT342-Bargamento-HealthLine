package edu.cit.bargamento.healthline.repository;

import edu.cit.bargamento.healthline.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByPatientEmail(String email);
}