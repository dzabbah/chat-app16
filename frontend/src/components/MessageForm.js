import React, { useState } from "react";

function MessageForm({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écris un message..."
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}

export default MessageForm;
