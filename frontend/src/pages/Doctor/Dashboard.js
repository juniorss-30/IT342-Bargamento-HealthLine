import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard.css';

const DoctorDashboard = () => {
    const [consultations, setConsultations] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Doctor', email: '' };

    useEffect(() => {
        // Fetch all consultations for the doctor to review
        axios.get('http://localhost:8080/api/v1/consultations')
            .then(res => setConsultations(res.data))
            .catch(err => console.error("Fetch error:", err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div className="nav-box active">Doctor Portal</div>
                    <div className="nav-box">Patient Queue</div>
                    <div className="nav-box">Schedules</div>
                    <div className="nav-box">Settings</div>

                    <div className="nav-box logout-box" onClick={handleLogout}>
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
                    <div className="summary-card">New Requests</div>
                    <div className="summary-card">Pending</div>
                    <div className="summary-card">Treated</div>
                </div>

                <div className="main-data-box-full">
                    <div className="request-section">
                        <h3>Patient Complaint Status</h3>
                        <p className="subtitle">Review incoming consultation requests below.</p>
                    </div>

                    <div className="divider-line"></div>

                    <div className="status-section">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Complaint</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consultations.length > 0 ? consultations.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.patientName}</td>
                                        <td>{c.chiefComplaint}</td>
                                        <td><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></td>
                                        <td><button className="btn-action">View</button></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4">No pending consultations.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;