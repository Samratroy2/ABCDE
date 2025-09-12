// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const { auth } = require('../middleware/auth'); // JWT auth middleware
const isAdmin = require('../middleware/isAdmin'); // Super admin check

// GET all users (super admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE user by userId (super admin only)
router.delete('/users/:userId', auth, isAdmin, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete user from MongoDB
    await user.deleteOne(); // Mongoose 7 compatible

    // Determine which dummy JSON file to delete from
    let dummyFile = '';
    if (user.role === 'doctor') dummyFile = 'dummyDoctorData.json';
    else if (user.role === 'patient') dummyFile = 'dummyPatientData.json';
    else if (user.role === 'pharmacist') dummyFile = 'dummyPharmacistData.json';

    if (dummyFile) {
      const filePath = path.join(__dirname, '../data', dummyFile);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const updatedData = data.filter(u => u.userId !== userId);
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
      }
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
