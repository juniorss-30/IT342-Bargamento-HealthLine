package com.bargamento.healthline.ui.doctor

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.bargamento.healthline.R
import com.bargamento.healthline.api.RetrofitClient
import com.bargamento.healthline.databinding.FragmentDoctorPatientQueueBinding
import com.bargamento.healthline.model.Consultation
import com.bargamento.healthline.model.MedicationRequest
import com.bargamento.healthline.model.ScheduleRequest
import com.bargamento.healthline.utils.SessionManager
import kotlinx.coroutines.launch

class DoctorPatientQueueFragment : Fragment() {

    private var _binding: FragmentDoctorPatientQueueBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: PatientQueueAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentDoctorPatientQueueBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        adapter = PatientQueueAdapter(
            emptyList(),
            onMedication = { consult -> showMedicationDialog(consult) },
            onSchedule = { consult -> showScheduleDialog(consult) },
            onMarkDone = { consult -> markConsultationDone(consult) }
        )
        binding.rvQueue.layoutManager = LinearLayoutManager(requireContext())
        binding.rvQueue.adapter = adapter

        loadQueue()
    }

    private fun loadQueue() {
        val token = sessionManager.getBearerToken()
        val myEmail = sessionManager.getEmail() ?: ""
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.getAllConsultations(token)
                if (response.isSuccessful) {
                    val all = response.body() ?: emptyList()
                    // Show only pending consultations for this doctor (status PENDING) and for any patient (no doctor filter needed server side)
                    val list = all.filter { it.status.equals("PENDING", ignoreCase = true) }
                    adapter.updateData(list)
                    binding.tvEmptyQueue.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error loading queue", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showMedicationDialog(consult: Consultation) {
        val input = EditText(requireContext())
        input.hint = "Enter prescription details"
        AlertDialog.Builder(requireContext())
            .setTitle("Prescribe Medication")
            .setMessage("Patient: ${consult.patientName}\nConcern: ${consult.concern}")
            .setView(input)
            .setPositiveButton("Prescribe") { _, _ ->
                val prescription = input.text.toString().trim()
                if (prescription.isEmpty()) return@setPositiveButton
                prescribeMedication(consult.patientEmail ?: "", prescription)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun showScheduleDialog(consult: Consultation) {
        val input = EditText(requireContext())
        input.hint = "Date (e.g. 2026-06-15 10:00)"
        AlertDialog.Builder(requireContext())
            .setTitle("Schedule Hospital Visit")
            .setMessage("Patient: ${consult.patientName}")
            .setView(input)
            .setPositiveButton("Schedule") { _, _ ->
                val date = input.text.toString().trim()
                if (date.isEmpty()) return@setPositiveButton
                scheduleVisit(consult.patientName ?: "", consult.patientEmail ?: "", date)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun prescribeMedication(patientEmail: String, prescription: String) {
        val token = sessionManager.getBearerToken()
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.prescribeMedication(
                    token, MedicationRequest(patientEmail, prescription)
                )
                if (response.isSuccessful) {
                    Toast.makeText(requireContext(), "Medication prescribed!", Toast.LENGTH_SHORT).show()
                    loadQueue()
                } else {
                    Toast.makeText(requireContext(), "Failed to prescribe", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Network error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun scheduleVisit(patientName: String, patientEmail: String, date: String) {
        val token = sessionManager.getBearerToken()
        lifecycleScope.launch {
            try {
                val request = ScheduleRequest(patientName, patientEmail, date)
                val response = RetrofitClient.instance.createSchedule(token, request)
                if (response.isSuccessful) {
                    Toast.makeText(requireContext(), "Visit scheduled!", Toast.LENGTH_SHORT).show()
                    loadQueue()
                } else {
                    Toast.makeText(requireContext(), "Failed to schedule", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Network error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun markConsultationDone(consult: Consultation) {
        val id = consult.id ?: return
        val token = sessionManager.getBearerToken()
        lifecycleScope.launch {
            try {
                val updates = mapOf("status" to "COMPLETED")
                val response = RetrofitClient.instance.updateConsultationStatus(token, id, updates)
                if (response.isSuccessful) {
                    Toast.makeText(requireContext(), "Consultation marked as done!", Toast.LENGTH_SHORT).show()
                    loadQueue()
                } else {
                    Toast.makeText(requireContext(), "Failed to mark done", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Network error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}