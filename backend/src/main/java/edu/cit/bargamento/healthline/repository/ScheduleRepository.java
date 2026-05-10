package edu.cit.bargamento.healthline.repository;

import edu.cit.bargamento.healthline.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}