// backend/middleware/auth.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Middleware: Authenticate user
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ match with payload: userId
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; // attach user object to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

// Middleware: Require specific roles
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { auth, requireRole };
