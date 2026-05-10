import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../css/patientdashboard.css';

const PatientDashboard = () => {
    const [complaint, setComplaint] = useState('');
    const [history, setHistory] = useState([]);
    const navigate = useNavigate(); // Initialize navigation

    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Juan Dela Cruz', email: '' };

    const fetchData = useCallback(() => {
        if (!user.email) return;
        axios.get('http://localhost:8080/api/v1/consultations')
            .then(res => setHistory(res.data.filter(c => c.patientEmail === user.email)))
            .catch(err => console.error("Database error:", err));
    }, [user.email]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Logout function to clear session and redirect
    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear the stored user data
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div className="nav-box active">Dashboard</div>
                    <div
                        className="nav-box"
                        onClick={() => navigate('/patient/consultations')}
                        style={{ cursor: 'pointer' }}
                    >
                        Consultations
                    </div>

                    <div className="nav-box">Prescription</div>
                    <div className="nav-box">Settings</div>

                    {/* Logout Button inside the Sidebar */}
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
                    <div className="summary-card">Upcoming</div>
                    <div className="summary-card">Completed</div>
                    <div className="summary-card">Total</div>
                </div>

                <div className="main-data-box-full">
                    <div className="status-section">
                        <h3>Current Status</h3>
                        <p>{history.length > 0 ? "Active consultation in progress." : "No records found."}</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;