const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ArchivedChat = sequelize.define("ArchivedChat", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: false });

module.exports = ArchivedChat;
