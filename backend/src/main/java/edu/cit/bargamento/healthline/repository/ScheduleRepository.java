package edu.cit.bargamento.healthline.repository;

import edu.cit.bargamento.healthline.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByPatientEmailAndStatusNot(String patientEmail, String status);
    List<Schedule> findByStatusNot(String status);
}