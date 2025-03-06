
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, ListGroup } from "react-bootstrap";
import "./EditGroup.css";

const EditGroup = ({ show, onHide, name, groupId }) => {
  const [groupUsers, setGroupUsers] = useState([]);
  const [nonGroupUsers, setNonGroupUsers] = useState([]);
  const [admin, setAdmin] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchGroupUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/group/groupUsers/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGroupUsers(response.data.groupUsers);
      setNonGroupUsers(response.data.nonGroupUsers);
      setAdmin(response.data.adminId);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  useEffect(() => {
    if (show) fetchGroupUsers();
  }, [show, groupId]);

  const handleUserAction = async (action, targetUserId, successMessage) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/group/${action}`,
        { groupId, userId: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(successMessage);
      if (action === "leave") {
        // If current user leaves or gets removed, reset selectedChat
        localStorage.removeItem("selectedChat");
        window.location.reload(); // Reload to reflect group removal
        onHide();
    } else {
        fetchGroupUsers(); // Fetch updated user list if others are removed
    }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="group-modal">
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Group Members</h5>
        <ListGroup>
          {groupUsers.map((user) => (
            <ListGroup.Item
              key={user.id}
              className="d-flex justify-content-between align-items-center"
            >
              {user.name}
              <div>
                {admin.includes(Number(userId)) && !user.isAdmin && (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleUserAction("makeAdmin", user.id, "Added Admin!")}
                  >
                    Make Admin
                  </Button>
                )} {" "}
                {admin.includes(Number(userId)) && user.id !== Number(userId) && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUserAction("removeUser", user.id, "User Removed!")}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {admin.includes(Number(userId)) && (
          <>
            <h5 className="mt-3">Add Users</h5>
            <ListGroup className="user-list">
              {nonGroupUsers.length > 0 ? (
                nonGroupUsers.map((user) => (
                  <ListGroup.Item
                    key={user.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {user.name}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleUserAction("addUser", user.id, "User added!")}
                    >
                      Add
                    </Button>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-muted">No users available to add.</p>
              )}
            </ListGroup>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-danger"
          onClick={() => handleUserAction("leave", userId, "You left the group.")}
        >
          Leave Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditGroup;
