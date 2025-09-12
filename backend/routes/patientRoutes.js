// backend/routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { auth } = require("../middleware/auth"); // If you have authentication middleware

const dummyPatientFile = path.join(__dirname, "../data/dummyPatientData.json");

// Utility to read/write patients
const readPatients = () =>
  fs.existsSync(dummyPatientFile)
    ? JSON.parse(fs.readFileSync(dummyPatientFile))
    : [];

const writePatients = (data) =>
  fs.writeFileSync(dummyPatientFile, JSON.stringify(data, null, 2));

// -------------------- Routes --------------------

// GET all patients
router.get("/", (req, res) => {
  try {
    const patients = readPatients();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET own profile (optional, requires auth)
router.get("/me", auth, (req, res) => {
  const patients = readPatients();
  const patient = patients.find((p) => p.userId === req.user.userId);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
});

// UPDATE own profile (optional, requires auth)
router.put("/me", auth, (req, res) => {
  const patients = readPatients();
  const index = patients.findIndex((p) => p.userId === req.user.userId);
  if (index === -1) return res.status(404).json({ message: "Patient not found" });

  const { name, contact, location, medicalHistory } = req.body;

  patients[index] = {
    ...patients[index],
    name: name || patients[index].name,
    contact: contact || patients[index].contact,
    location: location || patients[index].location,
    medicalHistory: medicalHistory
      ? Array.isArray(medicalHistory)
        ? medicalHistory
        : medicalHistory.split(",").map((h) => h.trim())
      : patients[index].medicalHistory,
  };

  writePatients(patients);
  res.json({ message: "Profile updated", patient: patients[index] });
});

// GET patient by userId
router.get("/:id", (req, res) => {
  const patients = readPatients();
  const patient = patients.find((p) => p.userId === req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
});

module.exports = router;
