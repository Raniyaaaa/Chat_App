const sequelize = require("../utils/database");

// Import models
const User = require("./User");
const Group = require("./Group");
const GroupUser = require("./GroupUser");
const Chat = require("./Chat");
const GroupMessage = require("./GroupMessage");

// Define Many-to-Many Relationships
User.belongsToMany(Group, {
  through: GroupUser,
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Group.belongsToMany(User, {
  through: GroupUser,
  foreignKey: "groupId",
  onDelete: "CASCADE",
});

// Define One-to-Many Relationships
Group.hasMany(GroupUser, { foreignKey: "groupId", onDelete: "CASCADE" });
GroupUser.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(GroupUser, { foreignKey: "userId", onDelete: "CASCADE" });
GroupUser.belongsTo(User, { foreignKey: "userId" });

Group.hasMany(GroupMessage, { foreignKey: "groupId", onDelete: "CASCADE" });
GroupMessage.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(GroupMessage, { foreignKey: "senderId", onDelete: "CASCADE" });
GroupMessage.belongsTo(User, { foreignKey: "senderId" });

User.hasMany(Chat, { foreignKey: "senderId", onDelete: "CASCADE" });
User.hasMany(Chat, { foreignKey: "receiverId", onDelete: "CASCADE" });

User.belongsToMany(Group, { through: GroupUser, foreignKey: "userId" });
Group.belongsToMany(User, { through: GroupUser, foreignKey: "groupId" });

module.exports = { sequelize, User, Group, GroupUser, Chat, GroupMessage };