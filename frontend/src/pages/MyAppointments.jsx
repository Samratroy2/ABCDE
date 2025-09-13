import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./MyAppointments.css";

const MyAppointments = () => {
  const { user } = useAuth(); // logged-in patient
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
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.userId]);

  if (loading) return <p className="loading-text">Loading your appointments...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="my-appointments-container">
      <h2>My Appointments</h2>
      {appointments.length === 0 && <p>No appointments found.</p>}

      {appointments.map((app) => (
        <div key={app.id} className="appointment-card">
          <p>
            <strong>Doctor:</strong> {app.doctorName} ({app.doctorEmail})
          </p>
          <p>
            <strong>Date:</strong> {app.date} <strong>Time:</strong> {app.time}
          </p>
          <p className={`appointment-status appointment-status-${app.status}`}>
            <strong>Status:</strong> {app.status}
          </p>

          {app.status === "approved" && (
            <p>
              <strong>Meeting Link:</strong>{" "}
              {app.meetLink ? (
                <a href={app.meetLink} target="_blank" rel="noreferrer" className="meeting-link">
                  {app.meetLink}
                </a>
              ) : (
                "Not provided"
              )}
            </p>
          )}

          {app.status === "rejected" && (
            <p className="appointment-status-rejected">Your appointment was rejected.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyAppointments;
