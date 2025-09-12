// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isSuperAdmin, getAllUsers, deleteUser } = require('../controllers/adminController');

// GET all users (only super admin)
router.get('/users', auth, isSuperAdmin, getAllUsers);

// DELETE a user (only super admin)
router.delete('/users/:id', auth, isSuperAdmin, deleteUser);

module.exports = router;
