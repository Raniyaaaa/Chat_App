// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Modal, Button, ListGroup, Spinner } from "react-bootstrap";
// import "./EditGroup.css";

// const EditGroup = ({ show, onHide, name, groupId }) => {
//   console.log(groupId);

//   const [groupUsers, setGroupUsers] = useState([]);
//   const [nonGroupUsers, setNonGroupUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!userId || !token) return;

//     const fetchGroupDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/group/groupUsers/${groupId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         console.log("Response:",response.data)
//         setGroupUsers(response.data.groupUsers);
//         setNonGroupUsers(response.data.nonGroupUsers);
//       } catch (error) {
//         console.error("Error fetching group details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGroupDetails();
//   }, [groupId, userId, token]);

//   const handleUserAction = async (url, body, successMessage) => {
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/group/${url}`,
//         body,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert(successMessage);
//       window.location.reload();
//     } catch (error) {
//       console.error(`Error performing action:`, error);
//       alert("Action failed.");
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered className="group-modal">
//       <Modal.Header closeButton>
//         <Modal.Title>{name}</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         {loading ? (
//           <div className="text-center">
//             <Spinner animation="border" />
//           </div>
//         ) : (
//           <>
//             {/* Group Members Section */}
//             <h5>Group Members</h5>
//             <ListGroup className="user-list">
//               {groupUsers.length > 0 ? (
//                 groupUsers.map((user) => (
//                   <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
//                     {user.name}
//                     <Button variant="danger" size="sm" onClick={() => handleUserAction("removeUser", { groupId, userId: user.id, adminId: userId }, "User removed!")}>
//                       Remove
//                     </Button>
//                   </ListGroup.Item>
//                 ))
//               ) : (
//                 <p className="text-muted">No members found.</p>
//               )}
//             </ListGroup>

//             {/* Add Users Section */}
//             <h5 className="mt-3">Add Users</h5>
//             <ListGroup className="user-list">
//               {nonGroupUsers.length > 0 ? (
//                 nonGroupUsers.map((user) => (
//                   <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
//                     {user.name}
//                     <Button variant="success" size="sm" onClick={() => handleUserAction("addUser", { groupId, userId: user.id, adminId: userId }, "User added!")}>
//                       Add
//                     </Button>
//                   </ListGroup.Item>
//                 ))
//               ) : (
//                 <p className="text-muted">No users available to add.</p>
//               )}
//             </ListGroup>
//           </>
//         )}
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="outline-danger" onClick={() => handleUserAction("leave", { groupId, userId }, "You left the group.")}>
//           Leave Group
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default EditGroup;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, ListGroup, Form } from "react-bootstrap";
import "./EditGroup.css";

const EditGroup = ({ show, onHide, name, groupId }) => {
    const [groupUsers, setGroupUsers] = useState([]);
    const [nonGroupUsers, setNonGroupUsers]= useState([]);
    const [admin, setAdmin]=useState([]);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchGroupUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/group/groupUsers/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Response",response.data);
                setGroupUsers(response.data.groupUsers);
                setNonGroupUsers(response.data.nonGroupUsers);
                setAdmin(response.data.adminId);
            } catch (error) {
                console.error("Error fetching group details:", error);
            }
        };
        fetchGroupUsers();
    }, [groupId]);


    const handleUserAction = async (action, groupId, userId, successMessage) => {
        const url = `${process.env.REACT_APP_API_BASE_URL}/group/${action}`;
        const body = { groupId, userId };
        await axios.post(url, body, { headers: { Authorization: `Bearer ${token}` } });
        alert(successMessage);
        window.location.reload();
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
                        <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                            {user.name}
                            
                              <div>
                              {admin.includes(Number(userId)) && !user.isAdmin && (
                              <Button variant="warning" size="sm" onClick={() => handleUserAction("makeAdmin", user.id, groupId, "Added Admin!")}>
                                  Make Admin
                              </Button>
                            )}{ "  "}
                            {admin.includes(Number(userId)) &&
                              <Button variant="danger" size="sm" onClick={() => handleUserAction("removeUser", groupId, user.id, "User Removed!")}>
                                  Remove
                              </Button>
                            }
                          </div>
                         
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <h5 className="mt-3">Add Users</h5>
               <ListGroup className="user-list">
                 {nonGroupUsers.length > 0 ? (
                   nonGroupUsers.map((user) => (
                     <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                       {user.name}
                       <Button variant="success" size="sm" onClick={() => handleUserAction("addUser", groupId, user.id , "User added!")}>
                         Add
                       </Button>
                     </ListGroup.Item>
                   ))
                 ) : (
                   <p className="text-muted">No users available to add.</p>
                 )}
               </ListGroup>
            </Modal.Body>

           <Modal.Footer>
             <Button variant="outline-danger" onClick={() => handleUserAction("leave", groupId, userId , "You left the group.")}>
               Leave Group
             </Button>
           </Modal.Footer>
        </Modal>
    );
};

export default EditGroup;
