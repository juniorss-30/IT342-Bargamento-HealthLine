import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/dashboard.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Doctor' };

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
                    <div className="nav-box">Schedules</div>
                    <div className="nav-box">Settings</div>
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

                <div className="main-data-box-full">
                    <h3>Welcome Doctor</h3>
                    <p className="subtitle">Select "Patient Queue" from the sidebar to manage incoming consultations.</p>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;