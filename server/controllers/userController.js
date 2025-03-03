const User = require('../models/User');
const { Op } = require("sequelize");

// Get all users except the logged-in user
exports.getAllUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const users = await User.findAll({
      where: { id: { [Op.ne]: userId } }, // Exclude the logged-in user
      attributes: ["id", "name", "email", "number"], // Exclude password
    });
    
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};