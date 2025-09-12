// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import Pharmacists from "./pages/Pharmacists";
import PharmacistsDetails from "./pages/PharmacistsDetails";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminPanel from "./pages/AdminPanel";
import MedicineSearch from "./pages/MedicineSearch";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Doctors />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <PrivateRoute>
              <Doctors />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctors/:id"
          element={
            <PrivateRoute>
              <DoctorDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <Patients />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <PrivateRoute>
              <PatientDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/pharmacists"
          element={
            <PrivateRoute>
              <Pharmacists />
            </PrivateRoute>
          }
        />
        <Route
          path="/pharmacists/:userId"
          element={
            <PrivateRoute>
              <PharmacistsDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/search-medicine"
          element={
            <PrivateRoute>
              <MedicineSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
