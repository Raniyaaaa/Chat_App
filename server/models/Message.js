const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const User = require("./User");

const Message = sequelize.define("Message", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("message", "join"), defaultValue: "message" },
});

Message.belongsTo(User, { foreignKey: "userId", allowNull: true });
module.exports = Message;
