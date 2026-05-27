package com.bargamento.healthline.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.bargamento.healthline.api.RetrofitClient
import com.bargamento.healthline.databinding.ActivityLoginBinding
import com.bargamento.healthline.model.LoginRequest
import com.bargamento.healthline.ui.doctor.DoctorMainActivity
import com.bargamento.healthline.ui.patient.PatientMainActivity
import com.bargamento.healthline.utils.SessionManager
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        sessionManager = SessionManager(this)

        if (sessionManager.isLoggedIn()) {
            navigateByRole(sessionManager.getRole())
            return
        }

        binding.btnSignIn.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            login(email, password)
        }

        binding.tvCreateAccount.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun login(email: String, password: String) {
        setLoading(true)
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.login(LoginRequest(email, password))

                // Check if response is null or body is empty
                if (response.isSuccessful) {
                    val body = response.body()

                    if (body != null && body.success) {
                        val user = body.data
                        if (user != null) {
                            sessionManager.saveSession("no-token", user.fullName ?: "User", user.email ?: email, user.role ?: "PATIENT", user.id ?: 0L)
                            navigateByRole(user.role)
                        } else {
                            Toast.makeText(this@LoginActivity, "User data missing", Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        Toast.makeText(this@LoginActivity, body?.error ?: "Login failed", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@LoginActivity, "Server error: ${response.code()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                // This catches the crash!
                android.util.Log.e("LoginError", "Error: ${e.localizedMessage}")
                Toast.makeText(this@LoginActivity, "Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
            } finally {
                setLoading(false)
            }
        }
    }

    private fun navigateByRole(role: String?) {
        val intent = if (role == SessionManager.ROLE_DOCTOR) {
            Intent(this, DoctorMainActivity::class.java)
        } else {
            Intent(this, PatientMainActivity::class.java)
        }
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }

    private fun setLoading(loading: Boolean) {
        binding.progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        binding.btnSignIn.isEnabled = !loading
    }
}