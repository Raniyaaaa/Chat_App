const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const GroupMessage = sequelize.define("GroupMessage", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "groups", key: "id" },
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
  },
  message: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = GroupMessage;