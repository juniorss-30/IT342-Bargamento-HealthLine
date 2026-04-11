/* Location: src/pages/Patient/Consultation.js */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard.css';

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

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div className="nav-box" onClick={() => navigate('/patient/dashboard')}>Dashboard</div>
                    <div className="nav-box active">Consultations</div>
                    <div className="nav-box">Medication</div>
                    <div className="nav-box logout-box" onClick={() => { localStorage.clear(); navigate('/login'); }}>
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
                        <p className="subtitle">Tell us what's wrong, and a doctor will review your case.</p>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                className="complaint-textarea"
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="e.g. I have a persistent cough and fever..."
                                rows="4"
                            />
                            <button
                                type="submit"
                                className="btn-submit-green"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Submit to Doctor'}
                            </button>
                        </form>
                    </div>

                    <div className="divider-line"></div>

                    {/* History Section */}
                    <h3>History</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Doctor Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map(h => (
                                <tr key={h.id}>
                                    <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                                    <td>{h.chiefComplaint}</td>
                                    <td>
                                        <span className={`status-pill ${h.status.toLowerCase()}`}>
                                            {h.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="3" className="no-records">No consultations found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Consultation;