const { Op } = require("sequelize");
const Message = require("../models/Message");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;

        if (!text) return res.status(400).json({ error: "Message cannot be empty" });

        const message = await Message.create({ text, userId });

        return res.status(201).json({ message });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { lastMessageId } = req.query;
        let messages;
        if (lastMessageId) {
            messages = await Message.findAll({
                where: { id: { [Op.gt]: lastMessageId } }, 
                include: [{ model: User, attributes: ["username"] }],
                order: [["createdAt", "ASC"]],
            });
        } else {
            messages = await Message.findAll({
                include: [{ model: User, attributes: ["username"] }],
                order: [["createdAt", "DESC"]],
                limit: 10, 
            });

            messages = messages.reverse(); 
        }

        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
