const express = require("express");
const router = express.Router();

// Exemple route test
router.get("/", (req, res) => {
  res.json({ message: "Route Messages OK 🚀" });
});

module.exports = router;
