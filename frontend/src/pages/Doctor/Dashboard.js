import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard.css';

const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState('portal');
    const [consultations, setConsultations] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Doctor' };

    const fetchConsultations = useCallback(() => {
        axios.get('http://localhost:8080/api/v1/consultations')
            .then(res => setConsultations(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetchConsultations();
    }, [fetchConsultations]);

    const handleDecision = async (id, status) => {
        try {
            await axios.put(`http://localhost:8080/api/v1/consultations/${id}`, {
                status
            });
            fetchConsultations();
        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>

                <nav className="nav-list">
                    <div
                        className={`nav-box ${activeTab === 'portal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('portal')}
                    >
                        Dashboard
                    </div>

                    <div
                        className={`nav-box ${activeTab === 'queue' ? 'active' : ''}`}
                        onClick={() => setActiveTab('queue')}
                    >
                        Patient Queue
                    </div>

                    <div className="nav-box">Schedules</div>
                    <div className="nav-box">Settings</div>

                    <div className="nav-box logout-box" onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                    }}>
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="main-viewport">
                <header className="content-header">
                    <h2 className="section-title">
                        {activeTab === 'portal' ? 'Doctor Dashboard' : 'Patient Queue'}
                    </h2>

                    <span className="user-label">Dr. {user.fullName}</span>
                </header>

                {/* DASHBOARD */}
                {activeTab === 'portal' ? (
                    <div className="main-data-box-full">
                        <h3>Welcome Doctor</h3>
                        <p className="subtitle">Use Patient Queue to manage consultations.</p>
                    </div>
                ) : (

                    /* QUEUE INSIDE SAME DASHBOARD STYLE */
                    <div className="main-data-box-full">

                        <div className="request-section">
                            <h3>Patient Queue</h3>
                            <p className="subtitle">
                                Review incoming consultations
                            </p>
                        </div>

                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Complaint</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {consultations.length > 0 ? consultations.map(c => (
                                <tr key={c.id}>
                                    <td>{c.patientName}</td>

                                    <td style={{
                                        maxWidth: '500px',
                                        whiteSpace: 'normal',
                                        lineHeight: '1.5'
                                    }}>
                                        {c.chiefComplaint}
                                    </td>

                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                style={{
                                                    background: '#4caf50',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => handleDecision(c.id, 'MEDICATION_PROVIDED')}
                                            >
                                                Medication
                                            </button>

                                            <button
                                                style={{
                                                    background: '#ef5350',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => handleDecision(c.id, 'HOSPITAL_VISIT_REQUIRED')}
                                            >
                                                Hospital Visit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3">No patients in queue</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;