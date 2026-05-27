package com.bargamento.healthline.utils

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("HealthLinePrefs", Context.MODE_PRIVATE)

    companion object {
        const val KEY_TOKEN = "token"
        const val KEY_NAME = "name"
        const val KEY_EMAIL = "email"
        const val KEY_ROLE = "role"
        const val KEY_USER_ID = "user_id"
        const val ROLE_PATIENT = "PATIENT"
        const val ROLE_DOCTOR = "DOCTOR"
    }

    fun saveSession(token: String, name: String, email: String, role: String, id: Long?) {
        prefs.edit().apply {
            putString(KEY_TOKEN, token)
            putString(KEY_NAME, name)
            putString(KEY_EMAIL, email)
            putString(KEY_ROLE, role)
            if (id != null) putLong(KEY_USER_ID, id)
            apply()
        }
    }

    fun getToken(): String? = prefs.getString(KEY_TOKEN, null)
    fun getName(): String? = prefs.getString(KEY_NAME, null)
    fun getEmail(): String? = prefs.getString(KEY_EMAIL, null)
    fun getRole(): String? = prefs.getString(KEY_ROLE, null)
    fun getUserId(): Long = prefs.getLong(KEY_USER_ID, -1L)

    fun getBearerToken(): String = "Bearer ${getToken()}"

    fun isLoggedIn(): Boolean = getToken() != null

    fun clearSession() {
        prefs.edit().clear().apply()
    }

    fun updateName(name: String) {
        prefs.edit().putString(KEY_NAME, name).apply()
    }
}