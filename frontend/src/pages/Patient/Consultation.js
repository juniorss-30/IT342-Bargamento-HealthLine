/* Location: src/pages/Patient/Consultation.js */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard.css';
import '../../css/consultation.css';

const Consultation = () => {
    const [history, setHistory] = useState([]);
    const [complaint, setComplaint] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'User', email: '' };

    const fetchHistory = useCallback(async () => {
        if (!user.email) return;
        try {
            const res = await axios.get('http://localhost:8080/api/v1/consultations');
            setHistory(res.data.filter(c => c.patientEmail === user.email));
        } catch (err) {
            console.error("Error fetching consultations:", err);
        }
    }, [user.email]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!complaint.trim()) return alert("Please describe your symptoms.");

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8080/api/v1/consultations', {
                patientName: user.fullName,
                patientEmail: user.email,
                chiefComplaint: complaint,
                status: "PENDING",
                createdAt: new Date().toISOString()
            });

            setComplaint('');
            fetchHistory();
            alert("Consultation submitted to the doctor!");
        } catch (err) {
            alert("Failed to send consultation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const latest = history.length > 0 ? history[history.length - 1] : null;

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div className="nav-box" onClick={() => navigate('/patient/dashboard')}>Dashboard</div>
                    <div className="nav-box active">Consultations</div>
                    <div className="nav-box">Medication</div>
                    <div
                        className="nav-box logout-box"
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}
                    >
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="main-viewport">
                <header className="content-header">
                    <h2 className="section-title">Consultations</h2>
                    <span className="user-label">{user.fullName}</span>
                </header>

                <div className="main-data-box-full">

                    {/* Input Section */}
                    <div className="request-section">
                        <h3>Request New Consultation</h3>
                        <p className="subtitle">
                            Tell us what's wrong, and a doctor will review your case.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <textarea
                                className="complaint-textarea"
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder={`Please describe in detail:

• What symptoms are you experiencing?
• When did it start?
• How severe is it?
• Any medication taken?

Example:
"I’ve had a cough for 5 days, mild fever at night, and headaches..."`}
                                rows="6"
                            />

                            <div className="submit-container">
                                <button
                                    type="submit"
                                    className="btn-submit-green"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Submit to Doctor'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="divider-line"></div>

                    {/* Doctor Decision Section */}
                    <div className="decision-section">
                        <h3>Doctor Decision</h3>

                        {latest ? (
                            <div className="decision-card">

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
                                    <p className="decision-label">Your Concern</p>
                                    <p className="decision-complaint">
                                        {latest.chiefComplaint}
                                    </p>
                                </div>

                                <div className="decision-footer">
                                    <span className={`status-pill ${latest.status.toLowerCase()}`}>
                                        {latest.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                            </div>
                        ) : (
                            <div className="no-records">No doctor decisions yet.</div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Consultation;