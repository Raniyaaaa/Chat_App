const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:userId",authMiddleware, getAllUsers); // Fetch all users except the logged-in user

module.exports = router;