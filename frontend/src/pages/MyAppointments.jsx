import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./MyAppointments.css";

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.userId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/patient/${user.userId}`
        );
        setAppointments(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user?.userId]);

  if (loading) return <p className="loading-text">Loading appointments...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="my-appointments-container">
      <h2>My Appointments</h2>
      {appointments.length === 0 && <p>No appointments found.</p>}

      {appointments.map((app) => (
        <div key={app.id} className="appointment-card">
          <p><strong>Doctor:</strong> {app.doctorName} ({app.doctorEmail})</p>
          <p><strong>Date:</strong> {app.date} <strong>Time:</strong> {app.time}</p>
          <p><strong>Status:</strong> {app.status}</p>

          {app.meetLink && (
            <p>
              <strong>Meeting Link:</strong>{" "}
              <a href={app.meetLink} target="_blank" rel="noreferrer">{app.meetLink}</a>
            </p>
          )}

          {app.prescription && (
            <p>
              <strong>Prescription:</strong>{" "}
              <a href={`http://localhost:5000${app.prescription}`} target="_blank" rel="noreferrer">
                View Prescription
              </a>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyAppointments;
