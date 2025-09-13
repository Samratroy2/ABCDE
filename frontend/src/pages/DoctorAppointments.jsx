import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./DoctorAppointments.css";

const DoctorAppointments = () => {
  const { user } = useAuth(); // logged-in doctor
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.userId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/doctor/${user.userId}`
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

  const handleAction = async (appointmentId, action, meetLink = "") => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        { status: action, meetLink }
      );

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: action, meetLink: res.data.meetLink } : a
        )
      );
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment");
    }
  };

  if (loading) return <p className="loading-text">Loading appointments...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="doctor-appointments-container">
      <h2>Appointment Requests</h2>
      {appointments.length === 0 && <p>No appointments found.</p>}

      {appointments.map((app) => (
        <div key={app.id} className="appointment-card">
          <p>
            <strong>Patient:</strong> {app.patientName} ({app.patientEmail})
          </p>
          <p>
            <strong>Date:</strong> {app.date} <strong>Time:</strong> {app.time}
          </p>
          <p className={`appointment-status appointment-status-${app.status}`}>
            <strong>Status:</strong> {app.status}
          </p>

          {app.status === "pending" && (
            <div className="action-box">
              <input
                type="text"
                placeholder="Enter meeting link"
                value={app.meetLink || ""}
                onChange={(e) =>
                  setAppointments((prev) =>
                    prev.map((a) =>
                      a.id === app.id ? { ...a, meetLink: e.target.value } : a
                    )
                  )
                }
                className="meeting-input"
              />
              <button
                className="btn-approve"
                onClick={() => handleAction(app.id, "approved", app.meetLink)}
              >
                Approve
              </button>
              <button
                className="btn-reject"
                onClick={() => handleAction(app.id, "rejected")}
              >
                Reject
              </button>
            </div>
          )}

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
            <p className="appointment-status-rejected">Appointment Rejected</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DoctorAppointments;
