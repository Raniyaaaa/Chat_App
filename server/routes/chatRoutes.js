const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chatController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", authenticateUser, sendMessage);
router.get("/messages", getMessages);

module.exports = router;
