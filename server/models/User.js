const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false }, // ✅ Changed 'name' to 'username'
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  number: { type: DataTypes.STRING, allowNull: false, unique: true }, // ✅ Use STRING instead of NUMBER
  password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = User;
