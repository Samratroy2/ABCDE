const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Path to appointments.json
const appointmentsPath = path.join(__dirname, "../data/appointments.json");

// ------------------ Helper functions ------------------

// Read appointments from file
const readAppointments = () => {
  if (fs.existsSync(appointmentsPath)) {
    const data = fs.readFileSync(appointmentsPath, "utf-8");
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Error parsing appointments.json:", err);
      return [];
    }
  }
  return [];
};

// Write appointments to file
const writeAppointments = (appointments) => {
  fs.writeFileSync(appointmentsPath, JSON.stringify(appointments, null, 2));
};

// Normalize IDs (trim, lowercase)
const normalizeId = (id) => id?.toString().trim().toLowerCase();

// ------------------ Routes ------------------

// GET all appointments
router.get("/", (req, res) => {
  const appointments = readAppointments();
  res.json(appointments);
});

// GET all appointments for a doctor
router.get("/doctor/:doctorId", (req, res) => {
  const appointments = readAppointments();
  const doctorAppointments = appointments.filter(
    (a) => normalizeId(a.doctorId) === normalizeId(req.params.doctorId)
  );
  res.json(doctorAppointments);
});

// GET all appointments for a patient
router.get("/patient/:patientId", (req, res) => {
  const appointments = readAppointments();
  const patientAppointments = appointments.filter(
    (a) => normalizeId(a.patientId) === normalizeId(req.params.patientId)
  );
  res.json(patientAppointments);
});

// POST: create new appointment
router.post("/", (req, res) => {
  const appointments = readAppointments();

  const newAppointment = {
    id: Date.now().toString(), // unique ID
    ...req.body,
    status: "pending",
    meetLink: "",
  };

  appointments.push(newAppointment);
  writeAppointments(appointments);

  res.status(201).json(newAppointment);
});

// PUT: approve/reject appointment + update meetLink
router.put("/:id", (req, res) => {
  const appointments = readAppointments();

  const idx = appointments.findIndex(
    (a) => normalizeId(a.id) === normalizeId(req.params.id)
  );
  if (idx === -1) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  // Update only allowed fields: status and meetLink
  const updatedFields = {};
  if (req.body.status) updatedFields.status = req.body.status;
  if (req.body.meetLink !== undefined) updatedFields.meetLink = req.body.meetLink;

  appointments[idx] = { ...appointments[idx], ...updatedFields };
  writeAppointments(appointments);

  res.json(appointments[idx]);
});

module.exports = router;
