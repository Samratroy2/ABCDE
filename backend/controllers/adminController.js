//backend\controllers\adminController.js

const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Middleware: Only super admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.email !== 'trysamrat1@gmail.com') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -otpExpires'); // hide sensitive info
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete profile photo if exists
    if (user.profilePhoto) {
      const filePath = path.join(__dirname, '../uploads', user.profilePhoto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

module.exports = { isAdmin, getAllUsers, deleteUser };
