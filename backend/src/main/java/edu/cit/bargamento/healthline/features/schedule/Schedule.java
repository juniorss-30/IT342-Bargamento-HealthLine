package edu.cit.bargamento.healthline.features.schedule;

import jakarta.persistence.*;

@Entity
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String patientName;
    private String appointmentDetails; // Date and Time string

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getAppointmentDetails() { return appointmentDetails; }
    public void setAppointmentDetails(String appointmentDetails) { this.appointmentDetails = appointmentDetails; }
}