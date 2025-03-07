const GroupMessage = require("../models/GroupMessage");
const GroupUser = require("../models/GroupUser");
const User = require('../models/User')
// Fetch all messages for a group
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      raw: true, // Flattens the result (removes nested objects)
      nest: true, // Keeps the nested structure for User
    });

    // Format response
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      groupId: msg.groupId,
      senderId: msg.senderId,
      senderName: msg.User.name,
      message: msg.message,
      createdAt: msg.createdAt,
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Send a message in a group
exports.sendGroupMessage = async (req, res) => {
  try {
    const { groupId, senderId, message } = req.body;

    // Check if the user is part of the group
    const isMember = await GroupUser.findOne({
      where: { groupId, userId: senderId },
    });
    if (!isMember)
      return res
        .status(403)
        .json({ error: "You are not a member of this group" });

    const newMessage = await GroupMessage.create({
      groupId,
      senderId,
      message,
    });

    res.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

