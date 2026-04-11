package edu.cit.bargamento.healthline.repository;

import edu.cit.bargamento.healthline.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> { }