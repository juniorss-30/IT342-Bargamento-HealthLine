import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../css/dashboard.css';
import '../../css/patientqueue.css';
import '../../css/schedules.css';

const Schedules = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [schedules, setSchedules] = useState([]);

    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Doctor' };

    const fetchSchedules = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/schedules');
            setSchedules(res.data);
        } catch (err) {
            console.error("Error fetching schedules:", err);
        }
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const markAsDone = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/schedules/${id}`);
            alert("Appointment marked as completed!");
            fetchSchedules();
        } catch (err) {
            console.error("Mark as done error:", err);
            alert("Failed to update schedule. Check console.");
        }
    };

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div className={`nav-box ${location.pathname === '/doctor/dashboard' ? 'active' : ''}`}
                         onClick={() => navigate('/doctor/dashboard')}>Dashboard</div>
                    <div className={`nav-box ${location.pathname === '/doctor/queue' ? 'active' : ''}`}
                         onClick={() => navigate('/doctor/queue')}>Patient Queue</div>
                    <div className={`nav-box ${location.pathname === '/doctor/schedules' ? 'active' : ''}`}
                         onClick={() => navigate('/doctor/schedules')}>Schedules</div>
                    <div className={`nav-box ${location.pathname === '/doctor/settings' ? 'active' : ''}`}
                         onClick={() => navigate('/doctor/settings')}>Settings</div>
                    <div className="nav-box logout-box" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</div>
                </nav>
            </aside>

            <main className="main-viewport">
                <header className="content-header">
                    <h2 className="section-title">Appointments Schedule</h2>
                    <span className="user-label">Dr. {user.fullName}</span>
                </header>

                <div className="main-data-box-full">
                    <div className="schedule-header-section">
                        <h3>Upcoming Visits</h3>
                        <p className="subtitle">Manage and track scheduled hospital appointments.</p>
                    </div>

                    <div className="schedule-grid">
                        {schedules.length > 0 ? (
                            schedules.map((s) => (
                                <div className="schedule-card" key={s.id}>
                                    <div className="schedule-card-header">
                                        <span className="schedule-status-badge">Confirmed</span>
                                    </div>
                                    <div className="schedule-card-body">
                                        <div className="schedule-info-block">
                                            <p className="schedule-label">Patient Name</p>
                                            <p className="schedule-value">{s.patientName}</p>
                                        </div>
                                        <div className="schedule-info-block">
                                            <p className="schedule-label">Appointment Details</p>
                                            <p className="schedule-value">{s.appointmentDetails}</p>
                                        </div>
                                    </div>
                                    <div className="schedule-card-footer">
                                        <button className="schedule-complete-btn" onClick={() => markAsDone(s.id)}>
                                            Mark as Done
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-schedules">No appointments found.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Schedules;