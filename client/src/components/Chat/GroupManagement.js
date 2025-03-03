import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const GroupManagement = () => {
  const [groups, setGroups] = useState([]); // Groups user is part of
  const [groupUsers, setGroupUsers] = useState([]); // Users in the selected group
  const [nonGroupUsers, setNonGroupUsers] = useState([]); // Users not in the selected group
  const [allUsers, setAllUsers] = useState([]); // All users to add to group
  const [newGroupName, setNewGroupName] = useState(""); // Group name input
  const [selectedGroup, setSelectedGroup] = useState(null); // Group selected for management
  const [selectedUsers, setSelectedUsers] = useState([]); // Users selected for new group
  const [lgShow, setLgShow] = useState(false); // Large modal state
  const userId = localStorage.getItem("userId"); // Get current user ID from storage
  const token = localStorage.getItem("token");

  // Fetch groups and users
  useEffect(() => {
    const fetchGroupsAndUsers = async () => {
      try {
        const groupRes = await axios.get(`http://localhost:8080/group/userGroups/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });
        setGroups(groupRes.data.groups);

        const userRes = await axios.get(`http://localhost:8080/users/${userId}`, {
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
        "http://localhost:8080/group/create",
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

  // Add user to group (Only Admin)
  const addUserToGroup = async (groupId, AddUserId) => {
    try {
      await axios.post(
        "http://localhost:8080/group/addUser",
        {
          groupId,
          userId: AddUserId,
          adminId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );
      alert("User added!");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Remove user from group (Only Admin)
  const removeUserFromGroup = async (groupId, removedUserId) => {
    try {
      await axios.post(
        "http://localhost:8080/group/removeUser",
        {
          groupId,
          userId: removedUserId,
          adminId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );
      alert("User removed!");
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  // Leave a group
  const leaveGroup = async (groupId) => {
    try {
      await axios.post(
        "http://localhost:8080/group/leave",
        {
          groupId,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );
      alert("You left the group.");
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const fetchGroupUsers = async (groupId) => {
    try {
      const response = await axios.get(`http://localhost:8080/group/groupUsers/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });

      setGroupUsers(response.data.groupUsers); // Users in the group
      setNonGroupUsers(response.data.nonGroupUsers); // Users not in the group
    } catch (error) {
      console.error("Error fetching group users:", error);
    }
  };

  // Handle group selection
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    fetchGroupUsers(group.id);
    setLgShow(true); // Open large modal when a group is selected
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

      {/* List Groups */}
      <h3>Your Groups</h3>
      <ul className="group-list">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => handleGroupSelect(group)}
            className="group-button"
          >
            {group.name}
          </button>
        ))}
      </ul>

      {/* Large Modal for Group Management */}
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        className="group-management-modal"
      >
        <Modal.Header closeButton className="modal-header">
          <Modal.Title id="example-modal-sizes-title-lg" className="modal-title">
            Manage {selectedGroup?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <h4>Group Members</h4>
          <ul className="group-members-list">
            {groupUsers.map((user) => (
              <li key={user.id} className="group-member-item">
                {user.name}
                <button
                  onClick={() => removeUserFromGroup(selectedGroup.id, user.id)}
                  className="remove-user-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h4>Add Users</h4>
          <ul className="non-group-members-list">
            {nonGroupUsers.map((user) => (
              <li key={user.id} className="non-group-member-item">
                {user.name}
                <button
                  onClick={() => addUserToGroup(selectedGroup.id, user.id)}
                  className="add-user-button"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => leaveGroup(selectedGroup.id)}
            className="leave-group-button"
          >
            Leave Group
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GroupManagement;