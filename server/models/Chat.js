const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Chat = sequelize.define("Chat", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
  },
  message: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Chat;