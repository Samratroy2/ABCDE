//backend\controllers\pharmacistController.js

const fs = require("fs");
const path = require("path");

const dummyPharmacistFile = path.join(__dirname, "../data/dummyPharmacistData.json");

const readPharmacists = () =>
  fs.existsSync(dummyPharmacistFile)
    ? JSON.parse(fs.readFileSync(dummyPharmacistFile))
    : [];

const writePharmacists = (data) =>
  fs.writeFileSync(dummyPharmacistFile, JSON.stringify(data, null, 2));

// 📌 Get all pharmacists
exports.getAllPharmacists = (req, res) => {
  try {
    const pharmacists = readPharmacists();
    res.json(pharmacists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Get pharmacist by ID
exports.getPharmacistById = (req, res) => {
  const pharmacist = readPharmacists().find((p) => p._id === req.params.id);
  if (!pharmacist) {
    return res.status(404).json({ message: "Pharmacist not found" });
  }
  res.json(pharmacist);
};

// 📌 Get logged-in pharmacist profile
exports.getMyProfile = (req, res) => {
  const pharmacist = readPharmacists().find((p) => p._id === req.user._id);
  if (!pharmacist) {
    return res.status(404).json({ message: "Pharmacist not found" });
  }
  res.json(pharmacist);
};

// 📌 Update logged-in pharmacist profile
exports.updateMyProfile = (req, res) => {
  const pharmacists = readPharmacists();
  const index = pharmacists.findIndex((p) => p._id === req.user._id);
  if (index === -1) {
    return res.status(404).json({ message: "Pharmacist not found" });
  }

  const { name, pharmacyName, licenseNumber, address, availableMedicines } = req.body;

  pharmacists[index] = {
    ...pharmacists[index],
    name: name || pharmacists[index].name,
    pharmacyName: pharmacyName || pharmacists[index].pharmacyName,
    licenseNumber: licenseNumber || pharmacists[index].licenseNumber,
    address: address || pharmacists[index].address,
    availableMedicines: availableMedicines
      ? Array.isArray(availableMedicines)
        ? availableMedicines
        : availableMedicines.split(",").map((m) => m.trim())
      : pharmacists[index].availableMedicines,
  };

  writePharmacists(pharmacists);
  res.json({ message: "Profile updated", pharmacist: pharmacists[index] });
};
