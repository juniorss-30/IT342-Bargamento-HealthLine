package com.bargamento.heathline.model

class Consultation {
    data class Consultation(
        val id: Long? = null,
        val patientName: String,
        val patientEmail: String,
        val chiefComplaint: String,
        val status: String = "PENDING",
        val createdAt: String? = null
    )
}