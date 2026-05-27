import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../css/dashboard.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Doctor' };

    const [consultations, setConsultations] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/consultations');
            setConsultations(res.data.reverse());
        } catch (err) {
            console.error("Error fetching consultations:", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const total = consultations.length;
    const pending = consultations.filter(c => c.status === 'PENDING').length;
    const completed = consultations.filter(c =>
        c.status === 'COMPLETED' ||
        c.status === 'RESOLVED' ||
        c.status === 'CLOSED' ||
        c.status === 'MEDICATION_PROVIDED' ||
        c.status === 'HOSPITAL_VISIT_REQUIRED'
    ).length;

    const latest = consultations[0];

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div className={`nav-box ${location.pathname === '/doctor/dashboard' ? 'active' : ''}`}
                         onClick={() => navigate('/doctor/dashboard')}>
                        Dashboard
                    </div>
                    <div className={`nav-box ${location.pathname === '/doctor/queue' ? 'active' : ''}`}
                         onClick={() => navigate('/doctor/queue')}>
                        Patient Queue
                    </div>
                    <div className={`nav-box ${location.pathname === '/doctor/schedules' ? 'active' : ''}`}
                         onClick={() => navigate('/doctor/schedules')}>
                        Schedules
                    </div>
                    <div className={`nav-box ${location.pathname === '/doctor/settings' ? 'active' : ''}`}
                         onClick={() => navigate('/doctor/settings')}>
                        Settings
                    </div>
                    <div className="nav-box logout-box" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="main-viewport">
                <header className="content-header">
                    <h2 className="section-title">Doctor Dashboard</h2>
                    <span className="user-label">Dr. {user.fullName}</span>
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
                        <span className="metric-label">Total Complaints</span>
                    </div>
                </div>

                <div className="main-data-box-full">
                    <div className="status-section">
                        <h3>Current Status</h3>
                        {latest ? (
                            <div className="decision-card" style={{ maxWidth: '100%' }}>
                                <div className="decision-header">
                                    <div className="decision-icon">🩺</div>
                                    <div>
                                        <p className="decision-title">Latest Review</p>
                                        <p className="decision-date">
                                            {new Date(latest.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="decision-body">
                                    <p className="decision-label">Patient Concern</p>
                                    <p className="decision-complaint">{latest.chiefComplaint}</p>
                                </div>
                                <div className="decision-footer">
                                    <span className={`status-pill ${latest.status.toLowerCase()}`}>
                                        {latest.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="no-records">No consultation records found.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;