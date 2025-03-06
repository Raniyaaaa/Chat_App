// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Button } from "react-bootstrap";
// import "./GroupManagement.css";

// const GroupManagement = () => {
//   const [groups, setGroups] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [newGroupName, setNewGroupName] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [showCreateGroup, setShowCreateGroup] = useState(false);
//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchGroupsAndUsers = async () => {
//       try {
//         const groupRes = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/group/userGroups/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setGroups(groupRes.data.groups);

//         const userRes = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setAllUsers(userRes.data);
//       } catch (error) {
//         console.error("Error fetching groups or users:", error);
//       }
//     };

//     fetchGroupsAndUsers();
//   }, [userId]);

//   const createGroup = async () => {
//     if (!newGroupName.trim() || selectedUsers.length === 0) {
//       alert("Enter a group name and select at least one member.");
//       return;
//     }

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/group/create`,
//         {
//           name: newGroupName,
//           creatorId: userId,
//           members: selectedUsers,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Group created successfully!");
//       setNewGroupName("");
//       setSelectedUsers([]);
//       setShowCreateGroup(false);
//     } catch (error) {
//       console.error("Error creating group:", error);
//       alert("Failed to create group.");
//     }
//   };

//   const deleteGroup = async (groupId) => {
//     try {
//       await axios.delete(
//         `${process.env.REACT_APP_API_BASE_URL}/group/delete/${groupId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert("Group deleted successfully!");
//       setGroups(groups.filter((group) => group.id !== groupId));
//     } catch (error) {
//       console.error("Error deleting group:", error);
//       alert("Failed to delete group.");
//     }
//   };

//   return (
//     <div className="group-management">
//       {/* Create Group Button */}
//       {!showCreateGroup && (
//       <button onClick={() => setShowCreateGroup(!showCreateGroup)} className="create-group-button">
//         Create Group
//       </button>
//       )}

//       {showCreateGroup && (
//         <div className="create-group-section">
//           <input
//             type="text"
//             placeholder="Enter group name"
//             value={newGroupName}
//             onChange={(e) => setNewGroupName(e.target.value)}
//             className="group-name-input"
//           />
//           <h4>Select Users</h4>
//           <ul className="user-list">
//             {allUsers.map((user) => (
//               <li key={user.id} className="user-list-item">
//                 <input
//                   type="checkbox"
//                   checked={selectedUsers.includes(user.id)}
//                   onChange={() =>
//                     setSelectedUsers((prev) =>
//                       prev.includes(user.id)
//                         ? prev.filter((id) => id !== user.id)
//                         : [...prev, user.id]
//                     )
//                   }
//                   className="user-checkbox"
//                 />
//                 {user.name}
//               </li>
//             ))}
//           </ul>
//           <button onClick={createGroup} className="create-group-button">
//             Create
//           </button>
//         </div>
//       )}

//       {/* List Groups */}
//       <div className="group-list-section">
//         <h3>Your Groups</h3>
//         <ul className="group-list">
//           {groups.map((group) => (
//             <li key={group.id} className="group-list-item">
//               <span>{group.name}</span>
//               {group.GroupUsers[0]?.isAdmin && (
//                 <button
//                   onClick={() => deleteGroup(group.id)}
//                   className="delete-group-button"
//                 >
//                   Delete Group
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default GroupManagement;

import { useState, useEffect } from "react";
import axios from "axios";
import "./GroupManagement.css";

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Function to fetch groups
  const fetchGroups = async () => {
    try {
      const groupRes = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/group/userGroups/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGroups(groupRes.data.groups || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const userRes = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllUsers(userRes.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch groups and users on component mount
  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, [userId]);

  // Function to create a new group
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Group created successfully!");
      setNewGroupName("");
      setSelectedUsers([]);
      setShowCreateGroup(false);
      fetchGroups(); // Auto-refresh the group list
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  // Function to delete a group
  const deleteGroup = async (groupId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/group/delete/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Group deleted successfully!");
      fetchGroups(); // Auto-refresh the group list after deletion
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group.");
    }
  };

  return (
    <div className="group-management">
      {/* Create Group Button */}
      {!showCreateGroup && (
        <button onClick={() => setShowCreateGroup(true)} className="create-group-button">
          Create Group
        </button>
      )}

      {showCreateGroup && (
        <div className="create-group-section">
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
            Create
          </button>
        </div>
      )}

      {/* List Groups */}
      <div className="group-list-section">
        <h3>Your Groups</h3>
        <ul className="group-list">
          {groups.map((group) => (
            <li key={group.id} className="group-list-item">
              <span>{group.name}</span>
              {group.GroupUsers[0]?.isAdmin && (
                <button onClick={() => deleteGroup(group.id)} className="delete-group-button">
                  Delete Group
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupManagement;
