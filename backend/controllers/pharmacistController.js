const fs = require("fs");
const path = require("path");

const dummyPharmacistFile = path.join(__dirname, "../data/dummyPharmacistData.json");

const readPharmacists = () =>
  fs.existsSync(dummyPharmacistFile)
    ? JSON.parse(fs.readFileSync(dummyPharmacistFile))
    : [];

const writePharmacists = (data) =>
  fs.writeFileSync(dummyPharmacistFile, JSON.stringify(data, null, 2));

// ------------------ CONTROLLERS ------------------

// Get all pharmacists
exports.getAllPharmacists = (req, res) => {
  try {
    const pharmacists = readPharmacists();
    res.json(pharmacists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pharmacist by userId
exports.getPharmacistByUserId = (req, res) => {
  const pharmacist = readPharmacists().find((p) => p.userId === req.params.userId);
  if (!pharmacist) {
    return res.status(404).json({ message: "Pharmacist not found" });
  }
  res.json(pharmacist);
};

// Get logged-in pharmacist profile
exports.getMyProfile = (req, res) => {
  const pharmacist = readPharmacists().find((p) => p.userId === req.user.userId);
  if (!pharmacist) {
    return res.status(404).json({ message: "Pharmacist not found" });
  }
  res.json(pharmacist);
};

// Search pharmacists by medicine name
exports.searchMedicine = (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Medicine name is required" });
    }

    const pharmacists = readPharmacists().filter((p) =>
      p.medicines?.some((m) => m.toLowerCase().includes(name.toLowerCase()))
    );

    res.json(pharmacists);
  } catch (err) {
    console.error("Error searching medicine:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update logged-in pharmacist profile
exports.updateMyProfile = (req, res) => {
  const pharmacists = readPharmacists();
  const index = pharmacists.findIndex((p) => p.userId === req.user.userId);
  if (index === -1) {
    return res.status(404).json({ message: "Pharmacist not found" });
  }

  const { name, pharmacyName, licenseNumber, address, medicines } = req.body;

  pharmacists[index] = {
    ...pharmacists[index],
    name: name || pharmacists[index].name,
    pharmacyName: pharmacyName || pharmacists[index].pharmacyName,
    licenseNumber: licenseNumber || pharmacists[index].licenseNumber,
    address: address || pharmacists[index].address,
    medicines: medicines
      ? Array.isArray(medicines)
        ? medicines
        : medicines.split(",").map((m) => m.trim())
      : pharmacists[index].medicines,
  };

  writePharmacists(pharmacists);
  res.json({ message: "Profile updated", pharmacist: pharmacists[index] });
};
