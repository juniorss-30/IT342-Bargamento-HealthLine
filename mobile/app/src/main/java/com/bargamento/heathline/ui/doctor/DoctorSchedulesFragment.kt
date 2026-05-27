package com.bargamento.healthline.ui.doctor

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.bargamento.healthline.api.RetrofitClient
import com.bargamento.healthline.databinding.FragmentDoctorSchedulesBinding
import com.bargamento.healthline.model.Schedule
import com.bargamento.healthline.utils.SessionManager
import kotlinx.coroutines.launch

class DoctorSchedulesFragment : Fragment() {

    private var _binding: FragmentDoctorSchedulesBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: ScheduleAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentDoctorSchedulesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        adapter = ScheduleAdapter(emptyList()) { schedule ->
            deleteSchedule(schedule)
        }
        binding.rvSchedules.layoutManager = LinearLayoutManager(requireContext())
        binding.rvSchedules.adapter = adapter

        loadSchedules()
    }

    private fun loadSchedules() {
        val token = sessionManager.getBearerToken()
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.getAllSchedules(token)
                if (response.isSuccessful) {
                    val list = response.body() ?: emptyList()
                    adapter.updateData(list)
                    binding.tvNoSchedules.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error loading schedules", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun deleteSchedule(schedule: Schedule) {
        val id = schedule.id ?: return
        val token = sessionManager.getBearerToken()
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.deleteSchedule(token, id)
                if (response.isSuccessful) {
                    Toast.makeText(requireContext(), "Schedule removed!", Toast.LENGTH_SHORT).show()
                    loadSchedules()
                } else {
                    Toast.makeText(requireContext(), "Failed", Toast.LENGTH_SHORT).show()
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