// backend/controllers/appointmentsController.js
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ---------------- Email Setup ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------------- Create Appointment ----------------
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patient = req.user;

    // Cannot book with self
    if (doctorId === patient.userId)
      return res.status(400).json({ message: "You cannot book an appointment with yourself." });

    const doctor = await User.findOne({ userId: doctorId, role: "doctor" });
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    const appointment = new Appointment({
      doctorId,
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      patientId: patient.userId,
      patientName: patient.name,
      patientEmail: patient.email,
      date,
      time,
      status: "pending",
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment request sent.", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- Get Doctor Appointments ----------------
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const appointments = await Appointment.find({ doctorId });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- Get Patient Appointments ----------------
const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const appointments = await Appointment.find({ patientId });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- Update Appointment Status ----------------
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meetLink } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found." });

    // Only doctor can approve/reject
    if (req.user.userId !== appointment.doctorId)
      return res.status(403).json({ message: "Not authorized." });

    appointment.status = status;
    if (status === "approved" && meetLink) appointment.meetLink = meetLink;

    await appointment.save();

    // ---------------- Send Email Notifications ----------------
    if (status === "approved") {
      const mailOptions = {
        from: `"Healthcare App" <${process.env.EMAIL_USER}>`,
        to: `${appointment.patientEmail},${appointment.doctorEmail}`,
        subject: `Appointment Approved with Dr. ${appointment.doctorName}`,
        text: `Your appointment on ${appointment.date} at ${appointment.time} has been approved.\nMeeting Link: ${appointment.meetLink || "To be shared"}`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error("Email error:", err);
        else console.log("Email sent:", info.response);
      });
    }

    res.json({ message: "Appointment updated.", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus
};
