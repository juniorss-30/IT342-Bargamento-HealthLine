package com.bargamento.healthline.api

import com.bargamento.healthline.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // --- Authentication ---
    @POST("api/v1/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/v1/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    // --- User Profile ---
    @GET("api/v1/user/me")
    suspend fun getMe(@Header("Authorization") token: String): Response<AuthResponse>

    @PUT("api/v1/users/{email}")
    suspend fun updateName(
        @Header("Authorization") token: String,
        @Path("email") email: String,
        @Body request: UpdateNameRequest
    ): Response<ApiResponse>

    @PUT("api/v1/users/{email}/password")
    suspend fun changePassword(
        @Header("Authorization") token: String,
        @Path("email") email: String,
        @Body request: ChangePasswordRequest
    ): Response<ApiResponse>

    // --- Consultations ---
    @GET("api/v1/consultations")
    suspend fun getAllConsultations(@Header("Authorization") token: String): Response<List<Consultation>>

    @POST("api/v1/consultations")
    suspend fun submitConsultation(
        @Header("Authorization") token: String,
        @Body request: ConsultationRequest
    ): Response<Consultation>

    @PUT("api/v1/consultations/{id}")
    suspend fun updateConsultationStatus(
        @Header("Authorization") token: String,
        @Path("id") id: Long,
        @Body updates: Map<String, String>
    ): Response<Consultation>

    // --- Medications ---
    @GET("api/v1/medications")
    suspend fun getAllMedications(@Header("Authorization") token: String): Response<List<Medication>>

    @POST("api/v1/medications")
    suspend fun prescribeMedication(
        @Header("Authorization") token: String,
        @Body request: MedicationRequest
    ): Response<Medication>

    // --- Schedules ---
    @GET("api/v1/schedules")
    suspend fun getAllSchedules(@Header("Authorization") token: String): Response<List<Schedule>>

    @POST("api/v1/schedules")
    suspend fun createSchedule(
        @Header("Authorization") token: String,
        @Body request: ScheduleRequest
    ): Response<Schedule>

    @DELETE("api/v1/schedules/{id}")
    suspend fun deleteSchedule(
        @Header("Authorization") token: String,
        @Path("id") id: Long
    ): Response<Void>
}