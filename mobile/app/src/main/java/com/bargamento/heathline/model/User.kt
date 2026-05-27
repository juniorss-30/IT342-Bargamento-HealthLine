package com.bargamento.heathline.model

class User {
    data class User(
        val id: Long?,
        val fullName: String,
        val email: String,
        val role: String, // "PATIENT" or "DOCTOR"
        val licenseNumber: String? = null
    )
}