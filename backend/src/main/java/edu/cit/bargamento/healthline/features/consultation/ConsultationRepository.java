package edu.cit.bargamento.healthline.features.consultation;

import edu.cit.bargamento.healthline.features.consultation.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> { }