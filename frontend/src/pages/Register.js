import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        passwordHash: '',
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
            alert(err.response?.data?.error?.message || "Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 py-12 px-4">
            <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600 tracking-tight">HealthLine</h1>
                    <p className="text-slate-500 mt-2">Join our healthcare community today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Juan Dela Cruz"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            required
                            onChange={e => setForm({...form, fullName: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="juan@email.com"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            required
                            onChange={e => setForm({...form, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            required
                            onChange={e => setForm({...form, passwordHash: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Role</label>
                        <select
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            value={form.role}
                            onChange={e => setForm({...form, role: e.target.value})}
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                        </select>
                    </div>

                    {form.role === 'DOCTOR' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Professional License Number</label>
                            <input
                                type="text"
                                placeholder="PRC-1234567"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                required
                                onChange={e => setForm({...form, licenseNumber: e.target.value})}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-green-500 text-white rounded-lg font-semibold shadow-lg shadow-green-200 hover:bg-green-600 active:transform active:scale-[0.98] transition-all"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                    <p className="text-sm text-slate-600">
                        Already have an account?
                        <Link to="/login" className="ml-1 text-green-600 font-semibold hover:text-green-700">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;