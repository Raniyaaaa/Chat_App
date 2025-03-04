import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import './GroupManagement.css'

const GroupManagement = () => {

  const [groups, setGroups] = useState([]); // Groups user is part of
  const [allUsers, setAllUsers] = useState([]); // All users to add to group
  const [newGroupName, setNewGroupName] = useState(""); // Group name input
  const [selectedUsers, setSelectedUsers] = useState([]); // Users selected for new group
  const userId = localStorage.getItem("userId"); // Get current user ID from storage
  const token = localStorage.getItem("token");
  
  // Fetch groups and users
  useEffect(() => {
    const fetchGroupsAndUsers = async () => {
      try {
        const groupRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/group/userGroups/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });
        setGroups(groupRes.data.groups);

        const userRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });
        setAllUsers(userRes.data);
      } catch (error) {
        console.error("Error fetching groups or users:", error);
      }
    };

    fetchGroupsAndUsers();
  }, [userId]);

  // Create a group
  const createGroup = async () => {
    if (!newGroupName.trim() || selectedUsers.length === 0) {
      alert("Enter a group name and select at least one member.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/group/create`,
        {
          name: newGroupName,
          creatorId: userId,
          members: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      alert("Group created successfully!");
      setNewGroupName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };


  return (
    <div className="group-management">

      {/* Create Group */}
      <div className="create-group-section">
        <h3>Create a Group</h3>
        <input
          type="text"
          placeholder="Enter group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="group-name-input"
        />
        <h4>Select Users</h4>
        <ul className="user-list">
          {allUsers.map((user) => (
            <li key={user.id} className="user-list-item">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() =>
                  setSelectedUsers((prev) =>
                    prev.includes(user.id)
                      ? prev.filter((id) => id !== user.id)
                      : [...prev, user.id]
                  )
                }
                className="user-checkbox"
              />
              {user.name}
            </li>
          ))}
        </ul>
        <button onClick={createGroup} className="create-group-button">
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupManagement;