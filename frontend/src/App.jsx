// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import Pharmacists from './pages/Pharmacists';
import PharmacistsDetails from './pages/PharmacistsDetails';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminPanel from './pages/AdminPanel';
import MedicineSearch from "./pages/MedicineSearch";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Default route -> Login page */}
        <Route path="/" element={<Login />} />

        {/* Home & Doctors */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />

        {/* Authentication */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Patients */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientDetails />} />

        {/* Pharmacists */}
        <Route path="/pharmacists" element={<Pharmacists />} />
        <Route path="/pharmacists/:userId" element={<PharmacistsDetails />} />
        <Route path="/search-medicine" element={<MedicineSearch />} />
        
        {/* Profile (Protected) */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
