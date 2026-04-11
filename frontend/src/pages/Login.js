import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(credentials);

            if (res.data.success) {
                const userData = res.data.data;

                // 1. Store the full user object (includes fullName, email, and role)
                localStorage.setItem('user', JSON.stringify(userData));

                // 2. Role-Based Redirection Logic
                if (userData.role === 'DOCTOR') {
                    navigate('/doctor/dashboard');
                } else if (userData.role === 'PATIENT') {
                    navigate('/patient/dashboard');
                } else {
                    // Fallback for general dashboard
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            // Displays the specific error from your createResponse backend utility
            const errorMsg = err.response?.data?.error || "Invalid email or password";
            alert(errorMsg);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header text-center mb-8">
                    <h1>HealthLine</h1>
                    <p>Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@email.com"
                            className="form-input"
                            required
                            onChange={e => setCredentials({...credentials, email: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="form-input"
                            required
                            onChange={e => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Sign In
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="login-link">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;