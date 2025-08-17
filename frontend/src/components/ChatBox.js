import React, { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../services/messageService";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        alert("⚠️ Vous devez être connecté pour voir les messages");
      }
    };
    fetchData();
  }, []);

  const handleSend = async () => {
    try {
      const newMsg = await sendMessage(text);
      setMessages((prev) => [...prev, newMsg]);
      setText("");
    } catch (err) {
      alert("⚠️ Vous devez être connecté pour envoyer un message");
    }
  };

  return (
    <div>
      <h2>💬 Chat</h2>
      <div style={{ border: "1px solid gray", padding: "10px", height: "200px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.sender?.username}:</b> {msg.text}
          </p>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écris un message..."
      />
      <button onClick={handleSend}>Envoyer</button>
    </div>
  );
}

export default ChatBox;
