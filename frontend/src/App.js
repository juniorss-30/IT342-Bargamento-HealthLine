import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/authentication/Login';
import Register from './features/authentication/Register';
import PatientDashboard from './layout/PatientDashboard';
import Consultation from './features/consultation/Consultation';
import DoctorDashboard from './layout/Dashboard';
import PatientQueue from './features/doctor-management/PatientQueue';
import Schedules from './features/doctor-management/Schedules';
import Medications from './features/patient-management/Medications';

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