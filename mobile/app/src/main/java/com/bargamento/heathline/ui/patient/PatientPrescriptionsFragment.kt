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
import com.bargamento.healthline.databinding.FragmentPatientPrescriptionsBinding
import com.bargamento.healthline.utils.SessionManager
import kotlinx.coroutines.launch

class PatientPrescriptionsFragment : Fragment() {

    private var _binding: FragmentPatientPrescriptionsBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: PrescriptionAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentPatientPrescriptionsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        adapter = PrescriptionAdapter(emptyList())
        binding.rvPrescriptions.layoutManager = LinearLayoutManager(requireContext())
        binding.rvPrescriptions.adapter = adapter

        loadPrescriptions()
    }

    private fun loadPrescriptions() {
        val token = sessionManager.getBearerToken()
        val myName = sessionManager.getName() ?: ""
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.getAllMedications(token)
                if (response.isSuccessful) {
                    val all = response.body() ?: emptyList()
                    // Client-side filter: only this patient's medications
                    val list = all.filter { it.patientName.equals(myName, ignoreCase = true) }
                    adapter.updateData(list)
                    binding.tvNoMedications.visibility =
                        if (list.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error loading prescriptions", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}