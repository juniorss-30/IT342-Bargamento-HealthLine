package com.bargamento.healthline.ui.doctor

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.bargamento.healthline.api.RetrofitClient
import com.bargamento.healthline.databinding.FragmentDoctorDashboardBinding
import com.bargamento.healthline.model.Consultation
import com.bargamento.healthline.utils.SessionManager
import kotlinx.coroutines.launch

class DoctorDashboardFragment : Fragment() {

    private var _binding: FragmentDoctorDashboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentDoctorDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        binding.tvDoctorName.text = "Dr. ${sessionManager.getName()}"

        binding.btnLogout.setOnClickListener { (activity as DoctorMainActivity).logout() }

        loadDashboard()
    }

    private fun loadDashboard() {
        val token = sessionManager.getBearerToken()
        lifecycleScope.launch {
            try {
                // Pull all consultations then compute stats client‑side
                val resp = RetrofitClient.instance.getAllConsultations(token)
                if (resp.isSuccessful) {
                    val all = resp.body() ?: emptyList()
                    val pending = all.count { it.status.equals("PENDING", ignoreCase = true) }
                    val completed = all.count { it.status.equals("COMPLETED", ignoreCase = true) }
                    val total = all.size
                    binding.tvPending.text = pending.toString()
                    binding.tvCompleted.text = completed.toString()
                    binding.tvTotal.text = total.toString()

                    // Show latest consultation (most recent based on createdAt if present)
                    val latest = all.maxByOrNull { it.createdAt ?: "" }
                    if (latest != null) {
                        binding.cardLatest.visibility = View.VISIBLE
                        binding.tvLatestDate.text = latest.createdAt ?: "-"
                        binding.tvLatestConcern.text = latest.concern ?: "-"
                        binding.tvLatestStatus.text = latest.status ?: "PENDING"
                    } else {
                        binding.cardLatest.visibility = View.GONE
                    }
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error loading dashboard", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}