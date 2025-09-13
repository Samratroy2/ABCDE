// backend/controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Temporary OTP store (use DB/Redis in production)
const otpStore = {};

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================== SIGNUP ==================
const signupUser = async (req, res) => {
  try {
    const { name, email, password, role, gender } = req.body;

    if (!name || !email || !password || !role || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "All fields (name, email, password, role, gender) are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Auto-generate fixed userId based on role
    let userId = "";
    if (role === "doctor") userId = "doctor981130694";
    else if (role === "patient") userId = "patient849590996";
    else if (role === "pharmacist") userId = "pharmacist902316739";
    else userId = role + Date.now() + Math.floor(Math.random() * 1000); // fallback

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create MongoDB User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      userId,
    });

    await newUser.save();

    // ---------------- Add user to corresponding JSON ----------------
    let filePath;
    let newEntry;

    if (role === "doctor") {
      filePath = path.join(__dirname, "../data/dummyDoctorData.json");
      const doctors = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
      newEntry = {
        userId,
        name,
        email,
        gender,
        role,
        location: "",
        contact: "",
        specialization: "",
        experience: 0,
        patientsServed: 0,
        rating: 0,
        medicalHistory: [],
        medicines: [],
        availability: [],
        image: "",
      };
      doctors.push(newEntry);
      fs.writeFileSync(filePath, JSON.stringify(doctors, null, 2));
    } else if (role === "patient") {
      filePath = path.join(__dirname, "../data/dummyPatientData.json");
      const patients = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
      newEntry = {
        userId,
        name,
        email,
        gender,
        role,
        age: null,
        location: "",
        contact: "",
        medicalHistory: [],
        medicines: [],
        availability: [],
      };
      patients.push(newEntry);
      fs.writeFileSync(filePath, JSON.stringify(patients, null, 2));
    } else if (role === "pharmacist") {
      filePath = path.join(__dirname, "../data/dummyPharmacistData.json");
      const pharmacists = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
      newEntry = {
        userId,
        name,
        email,
        gender,
        role,
        location: "",
        contact: "",
        pharmacyName: "",
        licenseNumber: "",
        address: "",
        medicalHistory: [],
        medicines: [],
        availability: [],
      };
      pharmacists.push(newEntry);
      fs.writeFileSync(filePath, JSON.stringify(pharmacists, null, 2));
    }
    // ----------------------------------------------------------------

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        gender: newUser.gender,
        userId: newUser.userId,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ================== LOGIN ==================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        userId: user.userId,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ================== FORGOT PASSWORD ==================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 min

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Healthcare App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
      });

      return res.json({ success: true, message: "OTP sent to email" });
    } catch (mailError) {
      console.error("Email error:", mailError.message);
      console.log(`OTP for ${email}: ${otp}`);
      return res.json({
        success: true,
        message: "OTP generated (check console in dev mode).",
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ================== RESET PASSWORD ==================
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const entry = otpStore[email];

    if (!entry || entry.otp !== otp || entry.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    delete otpStore[email]; // clear OTP

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
