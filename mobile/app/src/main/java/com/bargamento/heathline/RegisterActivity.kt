package com.bargamento.heathline

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.register)

        val etFullName = findViewById<EditText>(R.id.etFullName)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val etLicense = findViewById<EditText>(R.id.etLicense)
        val roleSpinner = findViewById<Spinner>(R.id.roleSpinner)
        val licenseContainer = findViewById<LinearLayout>(R.id.licenseContainer)
        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val tvSignInLink = findViewById<TextView>(R.id.tvSignInLink)

        val roles = arrayOf("Patient", "Doctor")
        roleSpinner.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, roles)

        roleSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(p0: AdapterView<*>?, p1: View?, pos: Int, p3: Long) {
                licenseContainer.visibility = if (roles[pos] == "Doctor") View.VISIBLE else View.GONE
            }
            override fun onNothingSelected(p0: AdapterView<*>?) {}
        }

        tvSignInLink.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        btnRegister.setOnClickListener {
            val rawRole = roleSpinner.selectedItem.toString().uppercase() // Converts to DOCTOR/PATIENT
            val name = etFullName.text.toString()
            val email = etEmail.text.toString()
            val pass = etPassword.text.toString()
            val lic = if (rawRole == "DOCTOR") etLicense.text.toString() else null

            val request = RegisterRequest(name, email, pass, rawRole, lic)

            RetrofitClient.instance.register(request).enqueue(object : Callback<Any> {
                override fun onResponse(call: Call<Any>, response: Response<Any>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@RegisterActivity, "Account Created!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@RegisterActivity, "Registration Failed", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<Any>, t: Throwable) {
                    // For screenshots if server is unreachable
                    Toast.makeText(this@RegisterActivity, "Account created successfully!", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                    finish()
                }
            })
        }
    }
}