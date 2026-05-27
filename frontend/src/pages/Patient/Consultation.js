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
            const filtered = res.data.filter(c => c.patientEmail === user.email);
            setHistory(filtered.reverse());
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
                    <div className="nav-box" onClick={() => navigate('/patient/medications')}>Prescription</div>
                    <div className="nav-box" onClick={() => navigate('/patient/settings')} style={{ cursor: 'pointer' }}>Settings</div>
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
                    <div className="request-section">
                        <h3>Request New Consultation</h3>
                        <p className="subtitle">Tell us what's wrong, and a doctor will review your case.</p>

                        <form onSubmit={handleSubmit}>
                            <textarea
                                className="complaint-textarea"
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="Describe your symptoms here..."
                                rows="6"
                            />
                            <div className="submit-container">
                                <button type="submit" className="btn-submit-green" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Submit to Doctor'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="divider-line"></div>

                    <div className="decision-section">
                        <h3>Consultation History</h3>
                        <div className="decision-grid">
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <div className="decision-card" key={item.id}>
                                        <div className="decision-header">
                                            <div className="decision-icon">🩺</div>
                                            <div>
                                                <p className="decision-title">Latest Review</p>
                                                <p className="decision-date">
                                                    {new Date(item.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="decision-body">
                                            <p className="decision-label">Your Concern</p>
                                            <p className="decision-complaint">{item.chiefComplaint}</p>
                                        </div>

                                        <div className="decision-footer">
                                            <span className={`status-pill ${item.status.toLowerCase()}`}>
                                                {item.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-records">No consultation records found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Consultation;