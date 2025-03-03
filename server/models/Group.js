const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Group = sequelize.define("Group", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

module.exports = Group;