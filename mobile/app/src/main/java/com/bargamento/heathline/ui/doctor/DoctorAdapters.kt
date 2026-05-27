package com.bargamento.healthline.ui.doctor

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bargamento.healthline.R
import com.bargamento.healthline.model.Consultation
import com.bargamento.healthline.model.Schedule

// ── Patient Queue Adapter ────────────────────────────────────────────────────

class PatientQueueAdapter(
    private var items: List<Consultation>,
    private val onMedication: (Consultation) -> Unit,
    private val onSchedule: (Consultation) -> Unit,
    private val onMarkDone: (Consultation) -> Unit
) : RecyclerView.Adapter<PatientQueueAdapter.VH>() {

    inner class VH(view: View) : RecyclerView.ViewHolder(view) {
        val tvPatientName: TextView = view.findViewById(R.id.tvQueuePatientName)
        val tvConcern: TextView = view.findViewById(R.id.tvQueueConcern)
        val btnMedication: Button = view.findViewById(R.id.btnMedication)
        val btnSchedule: Button = view.findViewById(R.id.btnSchedule)
        val btnMarkDone: Button = view.findViewById(R.id.btnMarkDone)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH =
        VH(LayoutInflater.from(parent.context).inflate(R.layout.item_patient_queue, parent, false))

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]
        holder.tvPatientName.text = item.patientName ?: "Unknown"
        holder.tvConcern.text = item.concern ?: "-"
        holder.btnMedication.setOnClickListener { onMedication(item) }
        holder.btnSchedule.setOnClickListener { onSchedule(item) }
        holder.btnMarkDone.setOnClickListener { onMarkDone(item) }
    }

    override fun getItemCount() = items.size

    fun updateData(newItems: List<Consultation>) {
        items = newItems
        notifyDataSetChanged()
    }
}

// ── Schedule Adapter ─────────────────────────────────────────────────────────

class ScheduleAdapter(
    private var items: List<Schedule>,
    private val onMarkDone: (Schedule) -> Unit
) : RecyclerView.Adapter<ScheduleAdapter.VH>() {

    inner class VH(view: View) : RecyclerView.ViewHolder(view) {
        val tvPatientName: TextView = view.findViewById(R.id.tvSchedulePatientName)
        val tvDate: TextView = view.findViewById(R.id.tvScheduleDate)
        val tvStatus: TextView = view.findViewById(R.id.tvScheduleStatus)
        val btnMarkDone: Button = view.findViewById(R.id.btnMarkDone)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH =
        VH(LayoutInflater.from(parent.context).inflate(R.layout.item_schedule, parent, false))

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]
        holder.tvPatientName.text = item.patientName ?: "Unknown"
        holder.tvDate.text = item.appointmentDate ?: "-"
        holder.tvStatus.text = item.status ?: "CONFIRMED"
        holder.btnMarkDone.setOnClickListener { onMarkDone(item) }
    }

    override fun getItemCount() = items.size

    fun updateData(newItems: List<Schedule>) {
        items = newItems
        notifyDataSetChanged()
    }
}