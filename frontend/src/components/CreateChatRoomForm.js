import React, { useState } from "react";
import { createChatRoom } from "../services/chatRoomService";

function CreateChatRoomForm({ onRoomCreated }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const room = await createChatRoom(name);
      onRoomCreated(room);
      setName("");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur création salle");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la salle"
        required
      />
      <button type="submit">Créer salle</button>
    </form>
  );
}

export default CreateChatRoomForm;
