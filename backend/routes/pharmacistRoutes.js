//backend\routes\pharmacistRoutes.js

const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const pharmacistController = require("../controllers/pharmacistController");

// GET all pharmacists
router.get("/", pharmacistController.getAllPharmacists);

// GET pharmacist by ID
router.get("/:id", pharmacistController.getPharmacistById);

// GET own profile
router.get("/me", auth, pharmacistController.getMyProfile);

// UPDATE own profile
router.put("/me", auth, pharmacistController.updateMyProfile);

module.exports = router;
