const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  doctorName: String,
  doctorEmail: String,
  patientId: { type: String, required: true },
  patientName: String,
  patientEmail: String,
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending / approved / rejected
  meetLink: String, // optional for online meeting link
  prescription: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
