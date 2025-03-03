const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const GroupUser = sequelize.define("GroupUser", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "groups", key: "id" },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
  },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = GroupUser;