//backend\routes\adminRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth"); // ✅ fixed
const fs = require("fs");
const path = require("path");

// GET all users (admin only)
router.get("/users", auth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// DELETE user (admin only)
router.delete("/users/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete profile photo if exists
    if (user.profilePhoto) {
      const filePath = path.join(__dirname, "../uploads", user.profilePhoto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

module.exports = router;
