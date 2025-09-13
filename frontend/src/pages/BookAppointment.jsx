// frontend/src/pages/BookAppointment.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./BookAppointment.css";

const BookAppointment = () => {
  const { user } = useAuth(); // logged-in patient
  const { doctorId } = useParams(); // doctor profile ID from URL
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("fetchDoctor error:", err);
        setMessage("Failed to load doctor profile.");
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Handle booking
  const handleBook = async () => {
    if (!doctor) return;
    if (doctor.userId === user.userId) {
      setMessage("You cannot book an appointment with yourself.");
      return;
    }
    if (!date || !time) {
      setMessage("Please select date and time.");
      return;
    }

    const payload = {
      patientId: user.userId,
      patientName: user.name,
      patientEmail: user.email,
      doctorId: doctor.userId,
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      date,
      time,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/appointments", payload);
      setMessage(res.data.message || "Appointment request sent successfully!");
    } catch (err) {
      console.error("Booking error:", err);
      setMessage("Failed to send appointment request.");
    }
  };

  if (!doctor) return <p className="loading-text">Loading doctor info...</p>;

  return (
    <div className="book-appointment-container">
      <div className="doctor-info-card">
        <h2>Book Appointment with Dr. {doctor.name}</h2>
        <p><strong>Specialization:</strong> {doctor.specialization || "N/A"}</p>
        <p><strong>Location:</strong> {doctor.location || "N/A"}</p>
      </div>

      <div className="appointment-form">
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>

        <button onClick={handleBook}>Book Appointment</button>
      </div>

      {message && <p className="message-text">{message}</p>}
    </div>
  );
};

export default BookAppointment;
