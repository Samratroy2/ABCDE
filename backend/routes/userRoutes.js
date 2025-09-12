// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// JSON files
const doctorFile = path.join(__dirname, '../data/dummyDoctorData.json');
const patientFile = path.join(__dirname, '../data/dummyPatientData.json');
const pharmacistFile = path.join(__dirname, '../data/dummyPharmacistData.json');

// Helpers to read/write JSON
const readFile = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : []);
const writeFile = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Multer setup for image upload
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Helper to get JSON file by role
const getFileByRole = (role) => {
  switch (role) {
    case 'doctor': return doctorFile;
    case 'patient': return patientFile;
    case 'pharmacist': return pharmacistFile;
    default: return null;
  }
};

// -------------------- GET current user --------------------
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// -------------------- UPDATE current user --------------------
router.put('/me', auth, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update basic fields
    const fields = [
      'name', 'email', 'age', 'location', 'contact',
      'specialization', 'experience', 'pharmacyName', 'patientsServed', 'rating',
      'licenseNumber', 'address'
    ];
    fields.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    // Update array fields
    if (req.body.medicalHistory) user.medicalHistory = req.body.medicalHistory.split(',').map(s => s.trim());
    if (req.body.medicines) user.medicines = req.body.medicines.split(',').map(s => s.trim());
    if (req.body.availability) user.availability = req.body.availability.split(',').map(s => s.trim());

    // Handle image upload
    if (req.file) user.image = `/uploads/${req.file.filename}`;

    await user.save();

    // ---------- Sync JSON files ----------
    const jsonFile = getFileByRole(user.role);
    if (jsonFile) {
      const usersJSON = readFile(jsonFile);
      const index = usersJSON.findIndex(u => u.userId === user.userId);
      const updatedUserJSON = {
        ...usersJSON[index],
        name: user.name,
        email: user.email,
        age: user.age,
        location: user.location,
        contact: user.contact,
        specialization: user.specialization,
        experience: user.experience,
        pharmacyName: user.pharmacyName,
        patientsServed: user.patientsServed,
        rating: user.rating,
        licenseNumber: user.licenseNumber,
        address: user.address,
        medicalHistory: user.medicalHistory,
        medicines: user.medicines,
        availability: user.availability,
        image: user.image,
      };
      if (index === -1) usersJSON.push(updatedUserJSON);
      else usersJSON[index] = updatedUserJSON;
      writeFile(jsonFile, usersJSON);
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
