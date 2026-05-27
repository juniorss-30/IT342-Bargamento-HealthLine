import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/patientdashboard.css';
import '../../css/medications.css';

const Medications = () => {
    const [medications, setMedications] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Patient', email: '' };

    useEffect(() => {
        if (user.email) {
            fetchMedications(user.email);
        }
    }, [user.email]);

    const fetchMedications = async (email) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/medications?email=${email}`);
            setMedications(res.data);
        } catch (err) {
            console.error("Error fetching medications:", err);
        }
    };

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div
                        className={`nav-box ${location.pathname === '/patient/dashboard' ? 'active' : ''}`}
                        onClick={() => navigate('/patient/dashboard')}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`nav-box ${location.pathname === '/patient/consultations' ? 'active' : ''}`}
                        onClick={() => navigate('/patient/consultations')}
                    >
                        Consultations
                    </div>
                    <div
                        className={`nav-box ${location.pathname === '/patient/medications' ? 'active' : ''}`}
                        onClick={() => navigate('/patient/medications')}
                    >
                        Prescriptions
                    </div>
                    <div
                        className={`nav-box ${location.pathname === '/patient/settings' ? 'active' : ''}`}
                        onClick={() => navigate('/patient/settings')}
                    >
                        Settings
                    </div>
                    <div className="nav-box logout-box" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="main-viewport">
                <header className="content-header">
                    <h2 className="section-title">My Medications</h2>
                    <span className="user-label">{user.fullName}</span>
                </header>

                <div className="main-data-box-full">
                    <div className="request-section">
                        <h3>Prescribed Treatments</h3>
                        <p className="subtitle">View dosage and instructions provided by your doctor.</p>
                    </div>

                    <div className="medication-list">
                        {medications.length > 0 ? (
                            medications.map((med) => (
                                <div className="med-card-item" key={med.id}>
                                    <div className="med-status-indicator">Active</div>
                                    <div className="med-content">
                                        <div className="med-header-info">
                                            <h4>Prescription</h4>
                                        </div>
                                        <p className="med-details-text">{med.details}</p>
                                        <div className="med-footer">
                                            <span className="date-issued">
                                                Issued: {new Date(med.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data-msg">
                                <p>No medications have been prescribed to you yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Medications;