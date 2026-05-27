package com.bargamento.healthline.ui.patient

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.bargamento.healthline.R
import com.bargamento.healthline.databinding.ActivityPatientMainBinding
import com.bargamento.healthline.ui.auth.LoginActivity
import com.bargamento.healthline.utils.SessionManager

class PatientMainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPatientMainBinding
    lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPatientMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        // Load default fragment
        loadFragment(PatientDashboardFragment())

        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_dashboard -> loadFragment(PatientDashboardFragment())
                R.id.nav_consultations -> loadFragment(PatientConsultationsFragment())
                R.id.nav_prescriptions -> loadFragment(PatientPrescriptionsFragment())
                R.id.nav_settings -> loadFragment(PatientSettingsFragment())
            }
            true
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }

    fun logout() {
        sessionManager.clearSession()
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }
}