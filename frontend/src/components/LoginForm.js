import React, { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token); // stocker le token
      alert("Connexion réussie");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
      <button type="submit">Se connecter</button>
    </form>
  );
}

export default LoginForm;
