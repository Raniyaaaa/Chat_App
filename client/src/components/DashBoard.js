
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "./Chat/chatComponent";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">{/* Sidebar for user list (40%) */}</div>
      <div className="chat-window">
        <ChatComponent />
      </div>
    </div>
  );
};

export default Dashboard;
