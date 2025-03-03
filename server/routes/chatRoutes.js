const express = require("express");
const { getMessages, sendMessage } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();

router.get("/:userId/:receiverId", authMiddleware, getMessages);
router.post("/" ,sendMessage);

module.exports = router;