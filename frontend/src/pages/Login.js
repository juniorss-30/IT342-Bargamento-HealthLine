import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(credentials);
            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.data));
                navigate('/dashboard');
            }
        } catch (err) {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            {/* The "rounded-2xl" and "shadow-xl" provide the curved, modern look */}
            <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600 tracking-tight">HealthLine</h1>
                    <p className="text-slate-500 mt-2">Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@email.com"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            required
                            onChange={e => setCredentials({...credentials, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            required
                            onChange={e => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold shadow-lg shadow-green-200 hover:bg-green-600 active:transform active:scale-[0.98] transition-all"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                    <p className="text-sm text-slate-600">
                        Don't have an account?
                        <Link to="/register" className="ml-1 text-green-600 font-semibold hover:text-green-700">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;