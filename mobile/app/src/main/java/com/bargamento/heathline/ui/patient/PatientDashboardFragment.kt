package com.bargamento.healthline.ui.patient

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.bargamento.healthline.api.RetrofitClient
import com.bargamento.healthline.databinding.FragmentPatientDashboardBinding
import com.bargamento.healthline.model.Schedule
import com.bargamento.healthline.utils.SessionManager
import kotlinx.coroutines.launch

class PatientDashboardFragment : Fragment() {

    private var _binding: FragmentPatientDashboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: AppointmentAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentPatientDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        binding.tvUserName.text = sessionManager.getName()

        adapter = AppointmentAdapter(emptyList())
        binding.rvAppointments.layoutManager = LinearLayoutManager(requireContext())
        binding.rvAppointments.adapter = adapter

        binding.btnLogout.setOnClickListener {
            (activity as PatientMainActivity).logout()
        }

        loadDashboard()
    }

    private fun loadDashboard() {
        val token = sessionManager.getBearerToken()
        val myEmail = sessionManager.getEmail() ?: ""
        lifecycleScope.launch {
            try {
                // Load all consultations and compute patient stats client-side
                val consultResp = RetrofitClient.instance.getAllConsultations(token)
                if (consultResp.isSuccessful) {
                    val all = consultResp.body() ?: emptyList()
                    val mine = all.filter { it.patientEmail.equals(myEmail, ignoreCase = true) }
                    val pending = mine.count { it.status.equals("PENDING", ignoreCase = true) }
                    val completed = mine.count { it.status.equals("COMPLETED", ignoreCase = true) }
                    val total = mine.size

                    binding.tvPending.text = pending.toString()
                    binding.tvCompleted.text = completed.toString()
                    binding.tvTotal.text = total.toString()
                }

                // Load all schedules, filter for this patient's upcoming ones
                val scheduleResponse = RetrofitClient.instance.getAllSchedules(token)
                if (scheduleResponse.isSuccessful) {
                    val allSchedules = scheduleResponse.body() ?: emptyList()
                    // Filter schedules belonging to this patient by name (backend stores patientName)
                    val myName = sessionManager.getName() ?: ""
                    val upcoming = allSchedules.filter {
                        it.patientName.equals(myName, ignoreCase = true)
                    }
                    adapter.updateData(upcoming)
                    binding.tvNoAppointments.visibility =
                        if (upcoming.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error loading data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}