// backend/routes/appointmentRoutes.js

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Path to appointments.json
const appointmentsPath = path.join(__dirname, "../data/appointments.json");

// ------------------ Helper functions ------------------
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

const writeAppointments = (appointments) => {
  fs.writeFileSync(appointmentsPath, JSON.stringify(appointments, null, 2));
};

const normalizeId = (id) => id?.toString().trim().toLowerCase();

// ------------------ Multer setup ------------------
const prescriptionsDir = path.join(__dirname, "../uploads/prescriptions");
if (!fs.existsSync(prescriptionsDir)) {
  fs.mkdirSync(prescriptionsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, prescriptionsDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({ storage });

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

// POST: create new appointment (supports optional prescription file)
router.post("/", upload.single("prescriptionFile"), (req, res) => {
  const appointments = readAppointments();

  const newAppointment = {
    id: Date.now().toString(),
    ...req.body,
    status: "pending",
    meetLink: "",
    prescription: req.file
      ? `/uploads/prescriptions/${req.file.filename}`
      : "", // store uploaded file path
  };

  appointments.push(newAppointment);
  writeAppointments(appointments);

  res.status(201).json({ message: "Appointment created", appointment: newAppointment });
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

  const updatedFields = {};
  if (req.body.status) updatedFields.status = req.body.status;
  if (req.body.meetLink !== undefined) updatedFields.meetLink = req.body.meetLink;

  appointments[idx] = { ...appointments[idx], ...updatedFields };
  writeAppointments(appointments);

  res.json(appointments[idx]);
});

// POST: doctor uploads prescription later
router.post("/:id/prescription", upload.single("prescription"), (req, res) => {
  const appointments = readAppointments();

  const idx = appointments.findIndex(
    (a) => normalizeId(a.id) === normalizeId(req.params.id)
  );
  if (idx === -1) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No prescription file uploaded" });
  }

  const prescriptionPath = `/uploads/prescriptions/${req.file.filename}`;

  appointments[idx].prescription = prescriptionPath;
  writeAppointments(appointments);

  res.json({
    message: "Prescription uploaded successfully",
    appointment: appointments[idx],
  });
});

module.exports = router;
