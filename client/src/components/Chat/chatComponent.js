import { useState, useEffect } from "react";
import axios from "axios";

const ChatComponent = () => { 

    const [users, setUsers] = useState([]); // Other users for personal chat
    const [groups, setGroups] = useState([]); // Groups user is part of
    const [selectedChat, setSelectedChat] = useState(null); // Stores selected user/group
    const [messages, setMessages] = useState([]); // Stores messages
    const [newMessage, setNewMessage] = useState(""); // New message input
    const userId = localStorage.getItem("userId"); // Get current user ID from storage
    const token = localStorage.getItem("token");
    
    useEffect(() => {
        const fetchUsersAndGroups = async () => {
          try {
            const userRes = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Add token to headers
                },
              }
            );
            setUsers(userRes.data);
    
            const groupRes = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/group/userGroups/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Add token to headers
                },
              }
            );
            setGroups(groupRes.data.groups);
          } catch (error) {
            console.error("Error fetching users or groups:", error);
          }
        };
    
        fetchUsersAndGroups();
      }, [userId]);
    
      // Fetch messages when chat is selected
      const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
          const url =
            selectedChat.type === "group"
              ? `http://localhost:8080/groupChat/${selectedChat.id}`
              : `http://localhost:8080/chat/${userId}/${selectedChat.id}`;
    
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to headers
            },
          });
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error.message);
        }
      };
    
      useEffect(() => {
        fetchMessages();
      }, [selectedChat]);
    
      // Send a message
      const sendMessage = async () => {
        if (!newMessage.trim()) return;
    
        try {
          const url =
            selectedChat.type === "group"
              ? "http://localhost:8080/groupChat"
              : "http://localhost:8080/chat";
    
          const data =
            selectedChat.type === "group"
              ? { groupId: selectedChat.id, senderId: userId, message: newMessage }
              : {
                  senderId: userId,
                  receiverId: selectedChat.id,
                  message: newMessage,
                };
    
          await axios.post(url, data);
    
          fetchMessages();
          setNewMessage("");
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };
    
      // Format time in 12-hour clock with AM/PM
      const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert to 12-hour format
        return `${hours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
      };
    
    
    return (
        <div className="chat-container">
          <div className="sidebar">
            <div className="chat-head">
              <h4>Chats</h4>
            </div>
            <div className="chat-list">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="chat-person"
                  onClick={() => setSelectedChat({ ...user, type: "user" })}
                >
                  {user.name}
                </div>
              ))}
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="chat-person"
                  onClick={() => setSelectedChat({ ...group, type: "group" })}
                >
                  {group.name}
                </div>
              ))}
            </div>
          </div>
    
          {/* Chat Window */}
          <div className="chat-window">
            {selectedChat && (
              <>
                <div className="inchat">
                  {" "}
                  <h3>&#128100; {selectedChat.name}</h3>
                </div>
    
                <div className="messages">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message-container ${
                        msg.senderId == userId ? "right" : "left"
                      }`}
                    >
                      <div className="message">
                        <p className="in-msg">{msg.message}</p>
                        <small>{formatTime(msg.createdAt)}</small>
                      </div>
                    </div>
                  ))}
                </div>
    
                <div className="message-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      );
};

export default ChatComponent;  
