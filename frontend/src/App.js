import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/Patient/PatientDashboard';
import Consultation from './pages/Patient/Consultation';
import DoctorDashboard from './pages/Doctor/Dashboard';
import PatientQueue from './pages/Doctor/PatientQueue';
import Schedules from './pages/Doctor/Schedules';
import Medications from './pages/Patient/Medications';

function App() {
  return (
      <Router>
        <Routes>
          {/* Default route redirects to Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Routes for Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/consultations" element={<Consultation />} />
          <Route path="/patient/medications" element={<Medications />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/queue" element={<PatientQueue />} />
          <Route path="/doctor/schedules" element={<Schedules />} /> {/* 2. Add the new route */}

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
  );
}

export default App