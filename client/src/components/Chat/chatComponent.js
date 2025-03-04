import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./chatComponent.css";
import { BiArrowBack, BiEditAlt, BiEdit } from "react-icons/bi";
import GroupManagement from "./GroupManagement";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EditGroup from "./EditGroup";

const ChatComponent = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [showEditGroup, setShowEditGroup] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const prevChatRef = useRef(null);

    useEffect(() => {
        const fetchUsersAndGroups = async () => {
            try {
                const [userRes, groupRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/group/userGroups/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setUsers(userRes.data);
                setGroups(groupRes.data.groups || []);
            } catch (error) {
                console.error("Error fetching users or groups:", error);
            }
        };
        fetchUsersAndGroups();
    }, [userId, token]);

    useEffect(() => {
        if (selectedChat && selectedChat.id && prevChatRef.current !== selectedChat) {
            fetchMessages();
            prevChatRef.current = selectedChat;
        }
    }, [selectedChat]);

    const fetchMessages = async () => {
        if (!selectedChat || !selectedChat.id) {
            console.warn("Invalid selectedChat:", selectedChat);
            return;
        }

        try {
            const url = selectedChat.type === "group"
                ? `${process.env.REACT_APP_API_BASE_URL}/groupChat/${selectedChat.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/chat/${userId}/${selectedChat.id}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error.response?.data || error.message);
        }
    };

    const handleEditGroup = (group) => {
        setSelectedGroup(group);
        setShowEditGroup(true);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const url = selectedChat.type === "group"
                ? `${process.env.REACT_APP_API_BASE_URL}/groupChat`
                : `${process.env.REACT_APP_API_BASE_URL}/chat`;

            const data = selectedChat.type === "group"
                ? { groupId: selectedChat.id, senderId: userId, message: newMessage }
                : { senderId: userId, receiverId: selectedChat.id, message: newMessage };

            const newMsg = {
                senderId: userId,
                message: newMessage,
                createdAt: new Date().toISOString()
            };
            setMessages((prevMessages) => [...prevMessages, newMsg]);

            await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });

            setNewMessage("");

            setTimeout(fetchMessages, 500);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <div className="chat-container">
            <div className="sidebar">
                <div className="chat-head">
                    <h4>Chats</h4>
                    <BiEditAlt onClick={() => setShowAdd(true)} />
                </div>
                <div className="chat-list">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="chat-person"
                            onClick={() => setSelectedChat({ id: user.id, name: user.name, type: "user" })}
                        >
                            {user.name}
                        </div>
                    ))}
                    {groups.map((group) => (
                        <div 
                            key={group.id} 
                            className="chat-person"
                            onClick={() => setSelectedChat({ id: group.id, name: group.name, type: "group" })}
                        >
                            {group.name}
                            <BiEdit 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditGroup(group);
                                }} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-window">
                {selectedChat ? (
                    <>
                        <div className="chat-header">
                            <BiArrowBack className="back-arrow" onClick={() => setSelectedChat(null)} />
                            <h3>👤 {selectedChat.name}</h3>
                        </div>
                        <div className="messages">
                            {messages.length === 0 ? (
                                <p className="no-chat-selected">No messages yet</p>
                            ) : (
                            messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.senderId == userId ? "sent" : "received"}`}>
                                {msg.senderId != userId && <p className="sender-name">{msg.senderName}</p>}
                                <p>{msg.message}</p>
                                <small>{formatTime(msg.createdAt)}</small>
                            </div>
                            ))
                            )}
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
                ) : (
                    <p className="no-chat-selected">Select a chat to start messaging</p>
                )}
            </div>

            <Modal show={showAdd} onHide={() => setShowAdd(false)} centered className="group-modal">
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title className="modal-title">Manage Groups</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    <GroupManagement />
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <Button variant="secondary" className="close-button" onClick={() => setShowAdd(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            {showEditGroup&& <EditGroup name={selectedGroup?.name} groupId={selectedGroup.id} show={showEditGroup} onHide={() => setShowEditGroup(false)}/>}
        </div>
    );
};

export default ChatComponent;
