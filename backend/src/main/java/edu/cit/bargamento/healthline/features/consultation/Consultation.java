package edu.cit.bargamento.healthline.features.consultation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "consultations")
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;
    private String patientEmail;

    @Column(columnDefinition = "TEXT")
    private String chiefComplaint;

    // Statuses: PENDING, ADVICE_PROVIDED, CLINIC_VISIT_REQUIRED
    private String status;
    private LocalDateTime createdAt;

    // Explicit setters to fix "cannot find symbol"
    public void setStatus(String status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Getters for JSON visibility
    public Long getId() { return id; }
    public String getStatus() { return status; }
    public String getPatientEmail() { return patientEmail; }
    public String getChiefComplaint() { return chiefComplaint; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getPatientName() { return patientName; }
}