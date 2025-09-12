//backend\controllers\userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Fetch user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, userId, password, specialization, experience, patientsServed, rating, location, contact, availability } = req.body;

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    if (userId && userId !== user.userId) {
      const exists = await User.findOne({ userId });
      if (exists) return res.status(400).json({ message: 'UserId already in use' });
      user.userId = userId;
    }

    user.name = name || user.name;

    if (password) user.password = await bcrypt.hash(password, 10);

    if (req.file) {
      if (user.profilePhoto) fs.unlinkSync(path.join(__dirname, '../uploads', user.profilePhoto));
      user.profilePhoto = req.file.filename;
    }

    if (user.role === 'doctor') {
      if (specialization) user.specialization = specialization;
      if (experience) user.experience = Number(experience);
      if (patientsServed) user.patientsServed = Number(patientsServed);
      if (rating) user.rating = Number(rating);
      if (location) user.location = location;
      if (contact) user.contact = contact;
      if (availability) user.availability = availability.split(',').map(d => d.trim());
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete profile image
const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.profilePhoto) return res.status(404).json({ message: 'No profile photo' });

    fs.unlinkSync(path.join(__dirname, '../uploads', user.profilePhoto));
    user.profilePhoto = undefined;
    await user.save();
    res.json({ message: 'Profile photo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

module.exports = { getUserById, updateUser, deleteProfileImage };
