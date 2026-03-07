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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-center text-green-600 mb-2">HealthLine</h1>
                <h2 className="text-lg font-semibold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" required
                        onChange={e => setForm({...form, fullName: e.target.value})} />

                    <input type="email" placeholder="Email" className="w-full p-2 border rounded" required
                        onChange={e => setForm({...form, email: e.target.value})} />

                    <input type="password" placeholder="Password" className="w-full p-2 border rounded" required
                        onChange={e => setForm({...form, passwordHash: e.target.value})} />

                    <select className="w-full p-2 border rounded" value={form.role}
                        onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="PATIENT">PATIENT</option>
                        <option value="DOCTOR">DOCTOR</option>
                    </select>

                    {form.role === 'DOCTOR' && (
                        <input type="text" placeholder="License Number (if doctor)" className="w-full p-2 border rounded" required
                            onChange={e => setForm({...form, licenseNumber: e.target.value})} />
                    )}

                    <button type="submit" className="w-full py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600">
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-green-600 hover:underline">Already have an account?</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;