import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/patientdashboard.css';

const PatientDashboard = () => {
    const [history, setHistory] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Juan Dela Cruz', email: '' };

    const fetchData = useCallback(async () => {
        if (!user.email) return;
        try {
            const res = await axios.get('http://localhost:8080/api/v1/consultations');
            const filtered = res.data.filter(c => c.patientEmail === user.email);
            setHistory(filtered.reverse());
        } catch (err) {
            console.error("Database error:", err);
        }
    }, [user.email]);

    const fetchSchedules = useCallback(async () => {
        if (!user.email) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/schedules?email=${user.email}`);
            setSchedules(res.data);
        } catch (err) {
            console.error("Schedule error:", err);
        }
    }, [user.email]);

    useEffect(() => {
        fetchData();
        fetchSchedules();
    }, [fetchData, fetchSchedules]);

    const total = history.length;
    const pending = history.filter(c => c.status === 'PENDING').length;
    const completed = history.filter(c =>
        c.status === 'COMPLETED' ||
        c.status === 'RESOLVED' ||
        c.status === 'CLOSED' ||
        c.status === 'MEDICATION_PROVIDED' ||
        c.status === 'HOSPITAL_VISIT_REQUIRED'
    ).length;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div className="nav-box active">Dashboard</div>
                    <div className="nav-box" onClick={() => navigate('/patient/consultations')} style={{ cursor: 'pointer' }}>
                        Consultations
                    </div>
                    <div className="nav-box" onClick={() => navigate('/patient/medications')} style={{ cursor: 'pointer' }}>
                        Prescription
                    </div>
                    <div className="nav-box" onClick={() => navigate('/patient/settings')} style={{ cursor: 'pointer' }}>
                        Settings
                    </div>
                    <div className="nav-box logout-box" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="main-viewport">
                <header className="content-header">
                    <h2 className="section-title">Dashboard</h2>
                    <span className="user-label">{user.fullName}</span>
                </header>

                <div className="summary-row">
                    <div className="summary-card">
                        <span className="metric-value">{pending}</span>
                        <span className="metric-label">Pending</span>
                    </div>
                    <div className="summary-card">
                        <span className="metric-value">{completed}</span>
                        <span className="metric-label">Completed</span>
                    </div>
                    <div className="summary-card">
                        <span className="metric-value">{total}</span>
                        <span className="metric-label">Total</span>
                    </div>
                </div>

                <div className="main-data-box-full">
                    {schedules.length > 0 && (
                        <div className="appointment-section">
                            <h3>Upcoming Appointment</h3>
                            <div className="appointment-list">
                                {schedules.map((s) => (
                                    <div className="appointment-card" key={s.id}>
                                        <div className="appointment-left">
                                            <div className="appointment-icon">📅</div>
                                            <div className="appointment-info">
                                                <p className="appointment-title">Scheduled Visit</p>
                                                <p className="appointment-time">{s.appointmentDetails}</p>
                                            </div>
                                        </div>
                                        <span className="appointment-badge">Confirmed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;