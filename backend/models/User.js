// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["patient", "doctor", "pharmacist"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },

  // Patient fields
  age: Number,
  medicalHistory: [String],

  // Doctor fields
  specialization: String,
  experience: Number,
  availability: [String],
  patientsServed: Number,
  rating: Number,
  location: String,
  contact: String,

  // Pharmacist fields
  pharmacyName: String,
  medicines: [String],

  image: String,
});

module.exports = mongoose.model("User", userSchema);
