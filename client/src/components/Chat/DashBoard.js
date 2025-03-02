import React, { useEffect, useState } from "react";
import axios from "axios";

const DashBoard = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/chat/messages").then((res) => setMessages(res.data));
    
    const poll = async () => {
      try {
        const res = await axios.get("http://localhost:8000/chat/poll");
        setMessages((prev) => [...prev, res.data]);
        poll();
      } catch (error) {
        setTimeout(poll, 3000);
      }
    };

    poll();
  }, []);

  const sendMessage = async () => {
    if (text.trim()) {
      await axios.post("http://localhost:8000/chat/send", { text, userId: user.id });
      setText("");
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
      {messages.map((msg, index) => (
  <p key={index}>
    {msg.userId === null ? ( // System message
      <strong>{msg.text}</strong>
    ) : (
      <>
        {msg.userId === user.id ? "You" : msg.User.name}: {msg.text}
      </>
    )}
  </p>
))}
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default DashBoard;
