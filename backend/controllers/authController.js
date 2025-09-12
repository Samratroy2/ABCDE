// backend/controllers/authController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

// JSON files
const doctorFile = path.join(__dirname, "../data/dummyDoctorData.json");
const patientFile = path.join(__dirname, "../data/dummyPatientData.json");
const pharmacistFile = path.join(__dirname, "../data/dummyPharmacistData.json");

// Helpers to read/write JSON
const readFile = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : []);
const writeFile = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Generate JWT
const generateToken = (user) =>
  jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// Get JSON file by role
const getFileByRole = (role) => {
  if (role === "doctor") return doctorFile;
  if (role === "patient") return patientFile;
  if (role === "pharmacist") return pharmacistFile;
  return null;
};

// ---------------- SIGNUP ----------------
const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Generate unique userId
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 900 + 100);
    const userId = `${role}${timestamp}${random}`;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to MongoDB
    const newUser = new User({ name, email, password: hashedPassword, role, userId });
    await newUser.save();

    // Save to JSON file
    const jsonFile = getFileByRole(role);
    if (jsonFile) {
      const usersJSON = readFile(jsonFile);
      const userJSON = {
        userId,
        name,
        email,
        role,
        image: "",
        medicalHistory: [],
        medicines: [],
        availability: [],
        patientsServed: 0,
        rating: 0,
      };
      usersJSON.push(userJSON);
      writeFile(jsonFile, usersJSON);
    }

    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// ---------------- LOGIN ----------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ---------------- FORGOT PASSWORD ----------------
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

// ---------------- RESET PASSWORD ----------------
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetOTP !== parseInt(otp) || Date.now() > user.resetOTPExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

module.exports = { signupUser, loginUser, forgotPassword, resetPassword };
