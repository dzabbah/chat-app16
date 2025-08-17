const express = require("express");
const router = express.Router();
const ChatRoom = require("../models/ChatRoom");
const authMiddleware = require("../middleware/authMiddleware");

// Créer une nouvelle salle
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await ChatRoom.findOne({ name });
    if (existing) return res.status(400).json({ message: "Salle déjà existante" });

    const newRoom = new ChatRoom({ name, users: [] });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Récupérer toutes les salles
router.get("/", authMiddleware, async (req, res) => {
  try {
    const rooms = await ChatRoom.find().populate("users", "username");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Rejoindre une salle
router.post("/join/:id", authMiddleware, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Salle introuvable" });

    if (!room.users.includes(req.user.id)) room.users.push(req.user.id);
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Quitter une salle
router.post("/leave/:id", authMiddleware, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Salle introuvable" });

    room.users = room.users.filter(u => u.toString() !== req.user.id);
    await room.save();
    res.json({ message: "Salle quittée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
