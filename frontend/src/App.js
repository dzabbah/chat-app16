import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ChatRoomsList from "./components/ChatRoomsList";
import CreateChatRoomForm from "./components/CreateChatRoomForm";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/register">Inscription</Link> |{" "}
        <Link to="/login">Connexion</Link> |{" "}
        <Link to="/chatrooms">Salles de chat</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/chatrooms" element={<ChatRoomsList />} />
        <Route path="/chatroom/:id" element={<ChatRoomLiveWrapper />} />
      </Routes>
    </Router>
  );
}

function ChatRoomLiveWrapper() {
    const { id } = useParams();
    return <ChatRoomLive roomId={id} />;
}
export default App;
