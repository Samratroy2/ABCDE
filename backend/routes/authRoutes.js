// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Unified routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
