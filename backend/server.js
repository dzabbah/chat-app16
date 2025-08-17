const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messageRoutes");
const chatRoomRoutes = require("./routes/chatRooms");
const authMiddleware = require("./middleware/authMiddleware");
const Message = require("./models/Message");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatrooms", chatRoomRoutes);

// Socket.IO
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token manquant"));
    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Token invalide"));
  }
});

io.on("connection", (socket) => {
  console.log(`Utilisateur connecté: ${socket.user.id}`);

  // Rejoindre salle
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("userJoined", { username: socket.user.email });
  });

  // Quitter salle
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit("userLeft", { username: socket.user.email });
  });

  // Envoyer message
  socket.on("sendMessage", async ({ roomId, text }) => {
    const newMsg = await Message.create({
      sender: socket.user.id,
      room: roomId,
      text,
    });
    const populatedMsg = await newMsg.populate("sender", "username email");
    io.to(roomId).emit("receiveMessage", populatedMsg);
  });

  socket.on("disconnect", () => {
    console.log(`Utilisateur déconnecté: ${socket.user.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend sur le port ${PORT}`));
