const GroupMessage = require("../models/GroupMessage");
const GroupUser = require("../models/GroupUser");
// Fetch all messages for a group
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
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

