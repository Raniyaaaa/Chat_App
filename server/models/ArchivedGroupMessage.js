const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ArchivedGroupMessage = sequelize.define("ArchivedGroupMessage", {
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
  createdAt: { type: DataTypes.DATE, allowNull: false },
});

module.exports = ArchivedGroupMessage;
