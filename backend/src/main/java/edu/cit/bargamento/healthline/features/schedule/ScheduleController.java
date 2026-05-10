package edu.cit.bargamento.healthline.features.schedule;

import edu.cit.bargamento.healthline.features.schedule.Schedule;
import edu.cit.bargamento.healthline.features.schedule.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {

    @Autowired
    private ScheduleRepository repository;

    @PostMapping
    public Schedule save(@RequestBody Schedule s) {
        return repository.save(s);
    }

    @GetMapping
    public List<Schedule> getAll() {
        return repository.findAll();
    }
}