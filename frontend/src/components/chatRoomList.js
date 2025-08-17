import React, { useEffect, useState } from "react";
import { getChatRooms, joinChatRoom, leaveChatRoom } from "../services/chatRoomService";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function ChatRoomsList() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await getChatRooms();
      setRooms(data);
    };
    fetchRooms();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("userJoined", (data) => alert(`${data.username} a rejoint la salle`));
    socket.on("userLeft", (data) => alert(`${data.username} a quitté la salle`));

    return () => socket.disconnect();
  }, []);

  const handleJoin = async (room) => {
    await joinChatRoom(room._id);
    setCurrentRoom(room);
    socket.emit("joinRoom", { roomId: room._id, username: localStorage.getItem("username") });
    setMessages([]);
  };

  const handleLeave = async () => {
    await leaveChatRoom(currentRoom._id);
    socket.emit("leaveRoom", { roomId: currentRoom._id, username: localStorage.getItem("username") });
    setCurrentRoom(null);
    setMessages([]);
  };

  const handleSend = () => {
    socket.emit("sendMessage", { roomId: currentRoom._id, message: text, username: localStorage.getItem("username") });
    setText("");
  };

  return (
    <div>
      {!currentRoom ? (
        <>
          <h2>Salles disponibles</h2>
          <ul>
            {rooms.map((room) => (
              <li key={room._id}>
                {room.name} <button onClick={() => handleJoin(room)}>Rejoindre</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>💬 {currentRoom.name}</h2>
          <div style={{ border: "1px solid gray", padding: "10px", height: "200px", overflowY: "auto" }}>
            {messages.map((msg, i) => (
              <p key={i}><b>{msg.username}:</b> {msg.message}</p>
            ))}
          </div>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Écris un message..." />
          <button onClick={handleSend}>Envoyer</button>
          <button onClick={handleLeave}>Quitter</button>
        </>
      )}
    </div>
  );
}

export default ChatRoomsList;
