const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const pharmacistController = require("../controllers/pharmacistController");

// GET all pharmacists
router.get("/", pharmacistController.getAllPharmacists);

// GET pharmacist by userId
router.get("/:userId", pharmacistController.getPharmacistByUserId);

// GET logged-in pharmacist profile
router.get("/me", auth, pharmacistController.getMyProfile);

// UPDATE logged-in pharmacist profile
router.put("/me", auth, pharmacistController.updateMyProfile);

module.exports = router;
