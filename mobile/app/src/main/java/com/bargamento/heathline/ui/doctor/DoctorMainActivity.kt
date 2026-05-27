package com.bargamento.healthline.ui.doctor

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.bargamento.healthline.R
import com.bargamento.healthline.databinding.ActivityDoctorMainBinding
import com.bargamento.healthline.ui.auth.LoginActivity
import com.bargamento.healthline.utils.SessionManager

class DoctorMainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDoctorMainBinding
    lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDoctorMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        loadFragment(DoctorDashboardFragment())

        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_dashboard -> loadFragment(DoctorDashboardFragment())
                R.id.nav_patient_queue -> loadFragment(DoctorPatientQueueFragment())
                R.id.nav_schedules -> loadFragment(DoctorSchedulesFragment())
                R.id.nav_settings -> loadFragment(DoctorSettingsFragment())
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