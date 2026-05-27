import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/dashboard.css';
import '../../css/settings.css';

const DoctorSettings = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const storedUser = JSON.parse(localStorage.getItem('user')) || { fullName: 'Doctor', email: '' };
    const [user, setUser] = useState(storedUser);
    const [fullName, setFullName] = useState(user.fullName || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!fullName.trim()) return alert("Name cannot be empty.");

        setIsUpdating(true);
        try {
            const encodedEmail = encodeURIComponent(user.email);
            const res = await axios.put(`http://localhost:8080/api/v1/users/${encodedEmail}`, {
                fullName: fullName
            });
            console.log("Update response:", res.data);

            const updatedUser = { ...user, fullName: fullName };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert("Name updated successfully!");
        } catch (err) {
            console.error("Update name error:", err.response?.data || err.message);
            alert("Failed to update name: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            return alert("Please fill in all password fields.");
        }
        if (newPassword !== confirmPassword) {
            return alert("New passwords do not match.");
        }

        setIsUpdating(true);
        try {
            const encodedEmail = encodeURIComponent(user.email);
            const res = await axios.put(`http://localhost:8080/api/v1/users/${encodedEmail}/password`, {
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            console.log("Password change response:", res.data);

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            alert("Password changed successfully!");
        } catch (err) {
            console.error("Change password error:", err.response?.data || err.message);
            alert("Failed to change password: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="full-screen-dashboard">
            <aside className="sidebar-full">
                <h2 className="brand-logo">HealthLine</h2>
                <nav className="nav-list">
                    <div
                        className={`nav-box ${location.pathname === '/doctor/dashboard' ? 'active' : ''}`}
                        onClick={() => navigate('/doctor/dashboard')}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`nav-box ${location.pathname === '/doctor/queue' ? 'active' : ''}`}
                        onClick={() => navigate('/doctor/queue')}
                    >
                        Patient Queue
                    </div>
                    <div
                        className={`nav-box ${location.pathname === '/doctor/schedules' ? 'active' : ''}`}
                        onClick={() => navigate('/doctor/schedules')}
                    >
                        Schedules
                    </div>
                    <div
                        className={`nav-box ${location.pathname === '/doctor/settings' ? 'active' : ''}`}
                        onClick={() => navigate('/doctor/settings')}
                    >
                        Settings
                    </div>
                    <div className="nav-box logout-box" onClick={handleLogout}>
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="main-viewport">
                <header className="content-header">
                    <h2 className="section-title">Doctor Settings</h2>
                    <span className="user-label">Dr. {user.fullName}</span>
                </header>

                <div className="main-data-box-full">
                    <div className="settings-section">
                        <h3>Profile Information</h3>
                        <p className="subtitle">Update your display name.</p>

                        <form onSubmit={handleUpdateProfile}>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" value={user.email} disabled />
                            </div>
                            <button type="submit" className="btn-submit-green" disabled={isUpdating}>
                                {isUpdating ? 'Updating...' : 'Update Name'}
                            </button>
                        </form>
                    </div>

                    <div className="divider-line"></div>

                    <div className="settings-section">
                        <h3>Change Password</h3>
                        <p className="subtitle">Secure your account with a new password.</p>

                        <form onSubmit={handleChangePassword}>
                            <div className="input-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="input-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button type="submit" className="btn-submit-green" disabled={isUpdating}>
                                {isUpdating ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorSettings;