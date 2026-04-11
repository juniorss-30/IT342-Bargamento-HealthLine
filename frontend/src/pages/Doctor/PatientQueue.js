import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/patientqueue.css';

const PatientQueue = () => {
    const [queue, setQueue] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Doctor' };

    const fetchQueue = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/consultations');
            setQueue(res.data);
        } catch (err) {
            console.error("Error fetching queue:", err);
        }
    }, []);

    useEffect(() => {
        fetchQueue();
    }, [fetchQueue]);

    const handleDecision = async (id, status) => {
        try {
            await axios.put(`http://localhost:8080/api/v1/consultations/${id}`, {
                status
            });
            fetchQueue();
        } catch (err) {
            alert("Update failed.");
        }
    };

    return (
        <div className="queue-page-container">
            <aside className="queue-sidebar">
                <h2 className="queue-logo">HealthLine</h2>

                <nav className="queue-nav">
                    <div className="q-nav-item" onClick={() => navigate('/doctor/dashboard')}>
                        Dashboard
                    </div>
                    <div className="q-nav-item active">
                        Patient Queue
                    </div>
                    <div className="q-nav-item">Schedules</div>

                    <div
                        className="q-nav-logout"
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}
                    >
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="queue-main-content">
                <header className="queue-header">
                    <div className="header-info">
                        <h1>Patient Queue</h1>
                        <p>Review and manage consultations</p>
                    </div>

                    <div className="doctor-tag">Dr. {user.fullName}</div>
                </header>

                <div className="queue-table-container">
                    <table className="queue-table">
                        <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Complaint</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {queue.length > 0 ? queue.map(q => (
                            <tr key={q.id}>
                                <td className="patient-name">{q.patientName}</td>

                                <td className="complaint-text full-view">
                                    {q.chiefComplaint}
                                </td>

                                <td>
                                    <div className="q-action-btns">
                                        <button
                                            className="btn-med"
                                            onClick={() => handleDecision(q.id, 'MEDICATION_PROVIDED')}
                                        >
                                            Medication
                                        </button>

                                        <button
                                            className="btn-hospital"
                                            onClick={() => handleDecision(q.id, 'HOSPITAL_VISIT_REQUIRED')}
                                        >
                                            Hospital Visit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="empty-msg">
                                    No patients in queue
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default PatientQueue;