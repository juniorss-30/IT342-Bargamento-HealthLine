import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// Import the role-specific dashboards
import PatientDashboard from './pages/Patient/PatientDashboard';
// IMPORT YOUR NEW CONSULTATION PAGE HERE
import Consultation from './pages/Patient/Consultation';
import DoctorDashboard from './pages/Doctor/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Routes for Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-Based Dashboard Routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

        {/* ADD THIS NEW ROUTE HERE */}
        <Route path="/patient/consultations" element={<Consultation />} />

        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

        {/* Catch-all redirect - This was catching your consultations click before! */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;