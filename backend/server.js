const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const httpServer = require("http").createServer(app);
//const io = new Server(httpServer, { cors: { origin: "*" } });

// Charger les variables d’environnement
dotenv.config();

// Connexion MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Route ChatRooms
const chatRoomRoutes = require("./routes/chatRooms");
app.use("/api/chatrooms", chatRoomRoutes);


// Route auth
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Routh Messages
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

// Importer les routes
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Serveur HTTP + Socket.io
const server = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
    console.log("Utilisateur connecté", socket.id);
  
    socket.on("joinRoom", ({ roomId, username }) => {
      socket.join(roomId);
      io.to(roomId).emit("userJoined", { username });
    });
  
    socket.on("leaveRoom", ({ roomId, username }) => {
      socket.leave(roomId);
      io.to(roomId).emit("userLeft", { username });
    });
  
    socket.on("sendMessage", ({ roomId, message, username }) => {
      io.to(roomId).emit("receiveMessage", { message, username });
    });
  
    socket.on("disconnect", () => {
      console.log("Utilisateur déconnecté", socket.id);
    });
  });

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Backend sur le port ${PORT}`));
