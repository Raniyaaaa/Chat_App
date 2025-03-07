const Chat = require("../models/Chat");
const ArchivedChat = require("../models/ArchivedChat");
const GroupMessage = require("../models/GroupMessage");
const ArchivedGroupMessage = require("../models/ArchivedGroupMessage"); // Assuming you'll create a similar model for archived group messages
const { Op } = require("sequelize");

/**
 * Moves chats older than 1 day to ArchivedChat and ArchivedGroupMessage tables and deletes them from original tables.
 */
exports.archiveOldMessages = async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Fetch old messages from the Chat table
    const oldChatMessages = await Chat.findAll({
      where: { createdAt: { [Op.lt]: oneDayAgo } },
      attributes: ["id", "senderId", "receiverId", "message", "createdAt"],
      raw: true,
    });

    // Fetch old messages from the GroupMessage table
    const oldGroupMessages = await GroupMessage.findAll({
      where: { createdAt: { [Op.lt]: oneDayAgo } },
      attributes: ["id", "groupId", "senderId", "message", "createdAt"],
      raw: true,
    });

    let archivedMessagesCount = 0;

    // Archive chat messages if there are any
    if (oldChatMessages.length > 0) {
      console.log(`Archiving ${oldChatMessages.length} chat messages...`);
      await ArchivedChat.bulkCreate(oldChatMessages, { ignoreDuplicates: true });
      await Chat.destroy({ where: { createdAt: { [Op.lt]: oneDayAgo } } });
      archivedMessagesCount += oldChatMessages.length;
    }

    // Archive group messages if there are any
    if (oldGroupMessages.length > 0) {
      console.log(`Archiving ${oldGroupMessages.length} group messages...`);
      await ArchivedGroupMessage.bulkCreate(oldGroupMessages, { ignoreDuplicates: true });
      await GroupMessage.destroy({ where: { createdAt: { [Op.lt]: oneDayAgo } } });
      archivedMessagesCount += oldGroupMessages.length;
    }

    // If messages were archived
    if (archivedMessagesCount > 0) {
      console.log(`✅ Successfully archived ${archivedMessagesCount} messages.`);
    } else {
      console.log("ℹ️ No messages to archive.");
    }

    if (res) res.status(200).json({ message: "Archiving process completed." });
  } catch (error) {
    console.error("❌ Error archiving messages:", error);
    if (res) res.status(500).json({ error: "Internal Server Error" });
  }
};
