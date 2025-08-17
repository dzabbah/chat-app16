const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

// 📌 Récupérer tous les messages (seulement si connecté)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().populate("sender", "username email");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// 📌 Envoyer un message (seulement si connecté)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const newMessage = new Message({
      sender: req.user.id, // récupéré depuis le JWT
      text,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
