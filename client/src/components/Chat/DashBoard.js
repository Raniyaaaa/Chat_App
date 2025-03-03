import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(storedUser);
      fetchMessages();
      const interval = setInterval(fetchMessages, 1000);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chat/messages`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/chat/send`,
            { text: newMessage },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
        );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  console.log("Message", messages);
  return (
    <div className="container">
      <h2>Chat Room</h2>
      <div className="chat-box">
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} className="message">
                <strong>
                  {localStorage.getItem("userId") == msg.userId 
                    ? "You: " 
                    : msg.User?.username 
                    ? msg.User.username + ": " 
                    : "..."}
                </strong>
              {msg.text}
            </p>
          ))
        )}
      </div>

      <div className="input-box">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
        <button onClick={sendMessage}>Send</button>
      </div>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
