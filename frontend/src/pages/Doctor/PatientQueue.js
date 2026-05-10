import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../css/dashboard.css'; // Maintains your sidebar and main layout
import '../../css/patientqueue.css'; // Handles table, buttons, and expansion forms

const PatientQueue = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Data State
    const [consultations, setConsultations] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [mode, setMode] = useState(''); // Tracks 'MED' or 'SCHED' form

    // Form States
    const [medDetails, setMedDetails] = useState('');
    const [schedDate, setSchedDate] = useState('');
    const [schedTime, setSchedTime] = useState('');

    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Doctor' };

    // Fetch pending consultations from backend
    const fetchConsultations = useCallback(() => {
        axios.get('http://localhost:8080/api/v1/consultations')
            .then(res => {
                // Filter to only show PENDING triage requests
                setConsultations(res.data.filter(q => q.status === 'PENDING'));
            })
            .catch(err => console.error("Error fetching consultations:", err));
    }, []);

    useEffect(() => {
        fetchConsultations();
    }, [fetchConsultations]);

    // Reset selection and form inputs
    const resetSelection = () => {
        setActiveId(null);
        setMode('');
        setMedDetails('');
        setSchedDate('');
        setSchedTime('');
    };

    // Handle Submission for Medication or Scheduling
    const handleAction = async (patient, type) => {
        try {
            if (type === 'MED') {
                if (!medDetails.trim()) return alert("Please enter medication details.");

                await axios.put(`http://localhost:8080/api/v1/consultations/${patient.id}`, {
                    status: 'MEDICATION_PROVIDED'
                });
                await axios.post('http://localhost:8080/api/v1/medications', {
                    patientEmail: patient.patientEmail,
                    details: medDetails
                });
            } else {
                if (!schedDate || !schedTime) return alert("Please select date and time.");

                await axios.put(`http://localhost:8080/api/v1/consultations/${patient.id}`, {
                    status: 'HOSPITAL_VISIT_REQUIRED'
                });
                await axios.post('http://localhost:8080/api/v1/schedules', {
                    patientName: patient.patientName,
                    appointmentDetails: `${schedDate} at ${schedTime}`
                });
            }

            alert("Action recorded successfully!");
            resetSelection();
            fetchConsultations();
        } catch (err) {
            console.error("Submit error:", err);
            alert("Failed to update records. Check backend services.");
        }
    };

    return (
        <div className="full-screen-dashboard">
            {/* SIDEBAR - Uses location.pathname to stay active on reload */}
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div
                        className={`nav-box ${location.pathname === '/doctor/dashboard' ? 'active' : ''}`}
                        onClick={() => navigate('/doctor/dashboard')}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`nav-box ${location.pathname === '/doctor/queue' ? 'active' : ''}`}
                        onClick={() => navigate('/doctor/queue')}
                    >
                        Patient Queue
                    </div>
                    <div
                        className={`nav-box ${location.pathname === '/doctor/schedules' ? 'active' : ''}`}
                        onClick={() => navigate('/doctor/schedules')}
                    >
                        Schedules
                    </div>
                    <div className="nav-box">Settings</div>
                    <div className="nav-box logout-box" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        Logout
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="main-viewport">
                <header className="content-header">
                    <h2 className="section-title">Patient Queue</h2>
                    <span className="user-label">Dr. {user.fullName}</span>
                </header>

                <div className="main-data-box-full">
                    <div className="request-section">
                        <h3>Pending Triage</h3>
                        <p className="subtitle">Review incoming consultations and provide medical guidance.</p>
                    </div>

                    <table className="modern-queue-table">
                        <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Chief Complaint</th>
                            <th className="text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {consultations.length > 0 ? (
                            consultations.map((c) => (
                                <React.Fragment key={c.id}>
                                    {/* Main Patient Row */}
                                    <tr className={activeId === c.id ? "row-selected" : ""}>
                                        <td className="patient-name-cell">{c.patientName}</td>
                                        <td className="complaint-preview-cell">{c.chiefComplaint}</td>
                                        <td>
                                            <div className="action-btn-group">
                                                <button className="q-btn med" onClick={() => { setActiveId(c.id); setMode('MED'); }}>
                                                    Medication
                                                </button>
                                                <button className="q-btn sched" onClick={() => { setActiveId(c.id); setMode('SCHED'); }}>
                                                    Schedule
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Professional Expansion Form */}
                                    {activeId === c.id && (
                                        <tr className="expansion-row">
                                            <td colSpan="3">
                                                <div className="expansion-container">
                                                    <div className="expansion-card">
                                                        <div className="card-header">
                                                            {mode === 'MED' ? `Prescribe Medication for ${c.patientName}` : `Set Hospital Visit for ${c.patientName}`}
                                                        </div>
                                                        <div className="card-body">
                                                            {mode === 'MED' ? (
                                                                <textarea
                                                                    className="expansion-textarea"
                                                                    placeholder="Enter medication details, dosage, and frequency..."
                                                                    value={medDetails}
                                                                    onChange={(e) => setMedDetails(e.target.value)}
                                                                />
                                                            ) : (
                                                                <div className="expansion-input-row">
                                                                    <div className="input-field">
                                                                        <label>Preferred Date</label>
                                                                        <input type="date" onChange={(e) => setSchedDate(e.target.value)} />
                                                                    </div>
                                                                    <div className="input-field">
                                                                        <label>Preferred Time</label>
                                                                        <input type="time" onChange={(e) => setSchedTime(e.target.value)} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="card-actions">
                                                                <button className="confirm-btn" onClick={() => handleAction(c, mode)}>Confirm Action</button>
                                                                <button className="cancel-btn" onClick={resetSelection}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="empty-queue-msg">
                                    No pending consultations found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default PatientQueue;