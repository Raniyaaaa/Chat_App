const express = require("express");
const {
  getGroupMessages,
  sendGroupMessage,
} = require("../controllers/groupChatController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:groupId",authMiddleware, getGroupMessages);
router.post("/",sendGroupMessage);

module.exports = router;