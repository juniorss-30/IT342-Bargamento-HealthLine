package com.bargamento.heathline

import com.google.gson.annotations.SerializedName
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

// 1. Data Models synchronized with Java User Entity
data class RegisterRequest(
    val fullName: String,
    val email: String,
    @SerializedName("passwordHash") val password: String, // Maps to Java passwordHash
    val role: String, // Sent as "DOCTOR" or "PATIENT"
    val licenseNumber: String?
)

data class LoginRequest(
    val email: String,
    val password: String
)

// 2. API Endpoints
interface AuthApi {
    @POST("api/v1/auth/register")
    fun register(@Body req: RegisterRequest): Call<Any>

    @POST("api/v1/auth/login")
    fun login(@Body req: LoginRequest): Call<Any>
}

// 3. Retrofit Client (10.0.2.2 is the bridge to XAMPP)
object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:8080/"
    val instance: AuthApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AuthApi::class.java)
    }
}