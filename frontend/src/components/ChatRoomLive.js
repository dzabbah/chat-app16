import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MessageForm from "./MessageForm";

function ChatRoomLive({ roomId }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const s = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
    });
    setSocket(s);

    s.emit("joinRoom", roomId);

    s.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on("userJoined", (data) => {
      setMessages((prev) => [...prev, { text: `${data.username} a rejoint la salle`, system: true }]);
    });

    s.on("userLeft", (data) => {
      setMessages((prev) => [...prev, { text: `${data.username} a quitté la salle`, system: true }]);
    });

    return () => {
      s.emit("leaveRoom", roomId);
      s.disconnect();
    };
  }, [roomId]);

  const handleSend = (text) => {
    socket.emit("sendMessage", { roomId, text });
  };

  return (
    <div>
      <h3>Salle de chat</h3>
      <div style={{ border: "1px solid gray", height: "300px", overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, i) => (
          <p key={i} style={{ color: msg.system ? "gray" : "black" }}>
            {msg.system ? msg.text : <><b>{msg.sender?.username}:</b> {msg.text} <i>({new Date(msg.createdAt).toLocaleTimeString()})</i></>}
          </p>
        ))}
      </div>
      <MessageForm onSend={handleSend} />
    </div>
  );
}

export default ChatRoomLive;
