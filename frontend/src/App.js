import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Routes for Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Placeholder for Dashboard */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl">Welcome to HealthLine Dashboard</div>} />
      </Routes>
    </Router>
  );
}

export default App;