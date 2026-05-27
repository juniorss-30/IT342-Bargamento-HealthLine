package com.bargamento.healthline.ui.patient

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bargamento.healthline.R
import com.bargamento.healthline.model.Consultation
import com.bargamento.healthline.model.Medication
import com.bargamento.healthline.model.Schedule

// ── Appointment Adapter ──────────────────────────────────────────────────────

class AppointmentAdapter(private var items: List<Schedule>) :
    RecyclerView.Adapter<AppointmentAdapter.VH>() {

    inner class VH(view: View) : RecyclerView.ViewHolder(view) {
        val tvTitle: TextView = view.findViewById(R.id.tvAppointmentTitle)
        val tvDate: TextView = view.findViewById(R.id.tvAppointmentDate)
        val tvStatus: TextView = view.findViewById(R.id.tvAppointmentStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH =
        VH(LayoutInflater.from(parent.context).inflate(R.layout.item_appointment, parent, false))

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]
        holder.tvTitle.text = "SCHEDULED VISIT"
        holder.tvDate.text = item.appointmentDate ?: "-"
        holder.tvStatus.text = item.status ?: "CONFIRMED"
    }

    override fun getItemCount() = items.size

    fun updateData(newItems: List<Schedule>) {
        items = newItems
        notifyDataSetChanged()
    }
}

// ── Consultation Adapter ─────────────────────────────────────────────────────

class ConsultationAdapter(private var items: List<Consultation>) :
    RecyclerView.Adapter<ConsultationAdapter.VH>() {

    inner class VH(view: View) : RecyclerView.ViewHolder(view) {
        val tvDate: TextView = view.findViewById(R.id.tvConsultDate)
        val tvConcern: TextView = view.findViewById(R.id.tvConsultConcern)
        val tvStatus: TextView = view.findViewById(R.id.tvConsultStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH =
        VH(LayoutInflater.from(parent.context).inflate(R.layout.item_consultation, parent, false))

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]
        holder.tvDate.text = item.createdAt ?: "-"
        holder.tvConcern.text = item.concern ?: "-"
        val status = item.status ?: "PENDING"
        holder.tvStatus.text = status
        val color = when (status.uppercase()) {
            "PENDING" -> Color.parseColor("#F59E0B")
            "MEDICATION PROVIDED" -> Color.parseColor("#10B981")
            "HOSPITAL VISIT REQUIRED" -> Color.parseColor("#EF4444")
            else -> Color.parseColor("#6B7280")
        }
        holder.tvStatus.setTextColor(color)
    }

    override fun getItemCount() = items.size

    fun updateData(newItems: List<Consultation>) {
        items = newItems
        notifyDataSetChanged()
    }
}

// ── Prescription Adapter ─────────────────────────────────────────────────────

class PrescriptionAdapter(private var items: List<Medication>) :
    RecyclerView.Adapter<PrescriptionAdapter.VH>() {

    inner class VH(view: View) : RecyclerView.ViewHolder(view) {
        val tvPrescription: TextView = view.findViewById(R.id.tvPrescriptionText)
        val tvStatus: TextView = view.findViewById(R.id.tvPrescriptionStatus)
        val tvIssued: TextView = view.findViewById(R.id.tvPrescriptionIssued)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH =
        VH(LayoutInflater.from(parent.context).inflate(R.layout.item_prescription, parent, false))

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]
        holder.tvPrescription.text = item.prescription ?: "-"
        holder.tvStatus.text = item.status ?: "ACTIVE"
        holder.tvIssued.text = "Issued: ${item.issuedAt ?: "-"}"
    }

    override fun getItemCount() = items.size

    fun updateData(newItems: List<Medication>) {
        items = newItems
        notifyDataSetChanged()
    }
}