//backend\routes\doctor.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { auth } = require('../middleware/auth');

const dummyDoctorFile = path.join(__dirname, '../data/dummyDoctorData.json');
const uploadsDir = path.join(__dirname, '../uploads');
const defaultImage = '/uploads/smiling-medical-doctor-woman-stethoscope-isolated-over-white-background-35552912.webp';

// Helper functions
const readDoctors = () =>
  fs.existsSync(dummyDoctorFile) ? JSON.parse(fs.readFileSync(dummyDoctorFile)) : [];

const writeDoctors = (data) =>
  fs.writeFileSync(dummyDoctorFile, JSON.stringify(data, null, 2));

// ------------------ Helper ------------------
// Ensure doctor image exists, else return default
const ensureImage = (imagePath) => {
  if (!imagePath) return defaultImage;
  const fullPath = path.join(__dirname, '..', imagePath);
  return fs.existsSync(fullPath) ? imagePath : defaultImage;
};

// ------------------ Routes ------------------

// Get all doctors
router.get('/', (req, res) => {
  const doctors = readDoctors().map((d) => ({
    ...d,
    image: ensureImage(d.image),
  }));
  res.json(doctors);
});

// Get doctor by userId
router.get('/:id', (req, res) => {
  const doctors = readDoctors();
  const doctor = doctors.find((d) => d.userId === req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  doctor.image = ensureImage(doctor.image);
  res.json(doctor);
});

// Get logged-in doctor profile
router.get('/me', auth, (req, res) => {
  const doctors = readDoctors();
  const doctor = doctors.find((d) => d.userId === req.user.userId);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  doctor.image = ensureImage(doctor.image);
  res.json(doctor);
});

module.exports = router;
