package com.bargamento.healthline.ui.patient

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.bargamento.healthline.api.RetrofitClient
import com.bargamento.healthline.databinding.FragmentSettingsBinding
import com.bargamento.healthline.model.ChangePasswordRequest
import com.bargamento.healthline.model.UpdateNameRequest
import com.bargamento.healthline.utils.SessionManager
import kotlinx.coroutines.launch

class PatientSettingsFragment : Fragment() {

    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())

        binding.etName.setText(sessionManager.getName())
        binding.etEmail.setText(sessionManager.getEmail())

        binding.btnUpdateName.setOnClickListener {
            val name = binding.etName.text.toString().trim()
            if (name.isEmpty()) {
                Toast.makeText(requireContext(), "Name cannot be empty", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            updateName(name)
        }

        binding.btnChangePassword.setOnClickListener {
            val current = binding.etCurrentPassword.text.toString()
            val newPass = binding.etNewPassword.text.toString()
            val confirm = binding.etConfirmPassword.text.toString()

            if (current.isEmpty() || newPass.isEmpty() || confirm.isEmpty()) {
                Toast.makeText(requireContext(), "Fill in all password fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (newPass != confirm) {
                Toast.makeText(requireContext(), "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            changePassword(current, newPass)
        }
    }

    private fun updateName(name: String) {
        val token = sessionManager.getBearerToken()
        val email = sessionManager.getEmail() ?: ""
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.updateName(token, email, UpdateNameRequest(name))
                if (response.isSuccessful) {
                    sessionManager.updateName(name)
                    Toast.makeText(requireContext(), "Name updated!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(requireContext(), "Failed to update name", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Network error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun changePassword(current: String, newPass: String) {
        val token = sessionManager.getBearerToken()
        val email = sessionManager.getEmail() ?: ""
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.changePassword(
                    token, email, ChangePasswordRequest(current, newPass)
                )
                if (response.isSuccessful) {
                    binding.etCurrentPassword.setText("")
                    binding.etNewPassword.setText("")
                    binding.etConfirmPassword.setText("")
                    Toast.makeText(requireContext(), "Password changed!", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(requireContext(), "Incorrect current password", Toast.LENGTH_SHORT).show()
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