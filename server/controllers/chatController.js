const { Op } = require("sequelize");
const Chat = require("../models/Chat");

exports.getMessages = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;
    
    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });
    
    res.json(messages);
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

exports.sendMessage = async (req, res) => {
  try { 
    
    const { senderId, receiverId, message } = req.body;
    console.log(senderId);
    const chat = await Chat.create({ senderId, receiverId, message });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};