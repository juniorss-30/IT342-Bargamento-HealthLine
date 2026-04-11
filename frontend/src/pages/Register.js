import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../css/register.css';

const Register = () => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '', // Aligned with Backend @JsonProperty
        role: 'PATIENT',
        licenseNumber: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registerUser(form);
            if (res.data.success) {
                alert("Account created successfully!");
                navigate('/login');
            }
        } catch (err) {
            // Updated error handling to match your createResponse utility
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header text-center mb-8">
                    <h1>HealthLine</h1>
                    <p>Join our healthcare community today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            placeholder="Juan Dela Cruz"
                            className="form-input"
                            required
                            onChange={e => setForm({...form, fullName: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="juan@email.com"
                            className="form-input"
                            required
                            onChange={e => setForm({...form, email: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="form-input"
                            required
                            onChange={e => setForm({...form, password: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Account Role</label>
                        <select
                            className="form-select"
                            value={form.role}
                            onChange={e => setForm({...form, role: e.target.value})}
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                        </select>
                    </div>

                    {form.role === 'DOCTOR' && (
                        <div className="doctor-field-anim">
                            <label className="form-label">Professional License Number</label>
                            <input
                                type="text"
                                placeholder="PRC-1234567"
                                className="form-input"
                                required
                                onChange={e => setForm({...form, licenseNumber: e.target.value})}
                            />
                        </div>
                    )}

                    <button type="submit" className="btn-register">
                        Create Account
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="register-link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;