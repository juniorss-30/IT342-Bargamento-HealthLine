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
import com.bargamento.healthline.databinding.FragmentPatientConsultationsBinding
import com.bargamento.healthline.model.ConsultationRequest
import com.bargamento.healthline.utils.SessionManager
import kotlinx.coroutines.launch

class PatientConsultationsFragment : Fragment() {

    private var _binding: FragmentPatientConsultationsBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: ConsultationAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentPatientConsultationsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        adapter = ConsultationAdapter(emptyList())
        binding.rvConsultations.layoutManager = LinearLayoutManager(requireContext())
        binding.rvConsultations.adapter = adapter

        binding.btnSubmit.setOnClickListener {
            val concern = binding.etConcern.text.toString().trim()
            if (concern.isEmpty()) {
                Toast.makeText(requireContext(), "Please describe your symptoms", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            submitConsultation(concern)
        }

        loadConsultations()
    }

    private fun submitConsultation(concern: String) {
        val token = sessionManager.getBearerToken()
        val patientName = sessionManager.getName() ?: ""
        val patientEmail = sessionManager.getEmail() ?: ""
        binding.btnSubmit.isEnabled = false

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.submitConsultation(
                    token, ConsultationRequest(patientName, patientEmail, concern)
                )

                if (response.isSuccessful) {
                    binding.etConcern.setText("")
                    Toast.makeText(requireContext(), "Consultation submitted!", Toast.LENGTH_SHORT).show()
                    loadConsultations()
                } else {
                    val errorBody = response.errorBody()?.string() ?: "No error body"
                    android.util.Log.e("SUBMIT_ERROR", "Error Code: ${response.code()} | Body: $errorBody")
                    Toast.makeText(requireContext(), "Error: ${response.code()} (Check Logcat)", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                android.util.Log.e("SUBMIT_ERROR", "Exception: ${e.message}")
                Toast.makeText(requireContext(), "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.btnSubmit.isEnabled = true
            }
        }
    }

    private fun loadConsultations() {
        val token = sessionManager.getBearerToken()
        val myEmail = sessionManager.getEmail() ?: ""
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.getAllConsultations(token)
                if (response.isSuccessful) {
                    val all = response.body() ?: emptyList()
                    // Client-side filter: only show this patient's consultations
                    val list = all.filter { it.patientEmail.equals(myEmail, ignoreCase = true) }
                    adapter.updateData(list)
                    binding.tvNoConsultations.visibility =
                        if (list.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error loading consultations", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}