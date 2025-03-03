// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     const storedUser = localStorage.getItem("userName");
//     if (!storedUser) {
//       navigate("/");
//     } else {
//       loadMessages();
//       const interval = setInterval(fetchMessages, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [navigate]);

//   const loadMessages = () => {
//     const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
//     setMessages(storedMessages);
//     fetchMessages(storedMessages);
//   };

//   const fetchMessages = async (storedMessages = []) => {
//     try {
//       const lastMessageId = storedMessages.length > 0 ? storedMessages[storedMessages.length - 1].id : 0;
//       const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chat/messages?lastMessageId=${lastMessageId}`);

//       if(res.data.messages.length > 0){
//         const updatedMessages = [...storedMessages, ...res.data.messages];
//         const recentMessages = updatedMessages.slice(-10);
//         setMessages(recentMessages);
//         localStorage.setItem("chatMessages", JSON.stringify(recentMessages));
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//         const res = await axios.post(
//             `${process.env.REACT_APP_API_BASE_URL}/chat/send`,
//             { text: newMessage },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//         );
//         setMessages((prev) => {
//           const updatedMessages = [...prev, res.data];
//           const recentMessages = updatedMessages.slice(-10);
//           localStorage.setItem("chatMessages", JSON.stringify(recentMessages));
//           return recentMessages;
//         });
//         setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("chatMessages");
//     navigate("/");
//   };

//   console.log("Message", messages);
//   return (
//     <div className="container">
//       <h2>Chat Room</h2>
//       <div className="chat-box">
//         {messages.length === 0 ? (
//           <p>No messages yet</p>
//         ) : (
//           messages.map((msg, index) => (
//             <p key={index} className="message">
//                 <strong>
//                   {localStorage.getItem("userId") == msg.userId 
//                     ? "You: " 
//                     : msg.User?.username 
//                     ? msg.User.username + ": " 
//                     : "..."}
//                 </strong>
//               {msg.text}
//             </p>
//           ))
//         )}
//       </div>

//       <div className="input-box">
//         <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
//         <button onClick={sendMessage}>Send</button>
//       </div>

//       <button className="logout-btn" onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "./Chat/chatComponent";
import GroupManagement from "./Chat/GroupManagement";

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
    <div className="dashboard-container">
      <div className="chat-layout">
        <div className="chat-window">
          <ChatComponent />
        </div>
      </div>
    </div>
    <div className="sidebar">
          <GroupManagement />
        </div>
    </>
  );
};

export default Dashboard;