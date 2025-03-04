const express = require("express");
const {
  createGroup,
  addUser,
  removeUser,
  makeAdmin,
  leaveGroup,
  deleteGroup,
  getUserGroups,
  getGroupUsers,
} = require("../controllers/groupController");
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/create",authMiddleware, createGroup);
router.post("/addUser",authMiddleware, addUser);
router.post("/removeUser",authMiddleware, removeUser);
router.post("/makeAdmin", authMiddleware,makeAdmin);
router.post("/leave",authMiddleware, leaveGroup);
router.delete("/delete",authMiddleware, deleteGroup);
router.get("/userGroups/:userId",authMiddleware, getUserGroups);
router.get("/groupUsers/:groupId",authMiddleware, getGroupUsers);
module.exports = router;