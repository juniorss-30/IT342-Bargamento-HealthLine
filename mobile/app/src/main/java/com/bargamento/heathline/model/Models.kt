package com.bargamento.healthline.model
import com.google.gson.annotations.SerializedName

data class AuthResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: User?,
    @SerializedName("error") val error: String?
)
data class RegisterRequest(
    @SerializedName("name") val fullName: String?,
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("role") val role: String
)

data class User(
    @SerializedName("id") val id: Long?,
    @SerializedName("fullName") val fullName: String?,
    @SerializedName("email") val email: String?,
    @SerializedName("role") val role: String?
)

data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)
data class Consultation(
    val id: Long?,
    val patientName: String?,
    val patientEmail: String?,
    @SerializedName("chiefComplaint") val concern: String?,
    val status: String?,
    val createdAt: String?,
    val doctorNote: String?
)

data class ConsultationRequest(
    val patientName: String,
    val patientEmail: String,
    @SerializedName("chiefComplaint") val chiefComplaint: String
)

data class Medication(
    val id: Long?,
    @SerializedName("details") val prescription: String?,
    val status: String?,
    @SerializedName("prescribedAt") val issuedAt: String?,
    val patientName: String?
)

data class MedicationRequest(
    @SerializedName("patientEmail") val patientEmail: String,
    @SerializedName("details") val details: String
)

data class Schedule(
    val id: Long?,
    val patientName: String?,
    @SerializedName("appointmentDetails") val appointmentDate: String?,
    val status: String?
)

data class ScheduleRequest(
    @SerializedName("patientName") val patientName: String,
    @SerializedName("patientEmail") val patientEmail: String,
    @SerializedName("appointmentDetails") val appointmentDetails: String
)

data class DashboardStats(
    val pending: Int,
    val completed: Int,
    val total: Int
)

data class UpdateNameRequest(
    val name: String
)

data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String
)

data class ApiResponse(
    val message: String?,
    val success: Boolean?
)