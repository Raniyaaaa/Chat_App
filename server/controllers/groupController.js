// const Group = require("../models/Group");
// const GroupUser = require("../models/GroupUser");
// const GroupMessage = require("../models/GroupMessage");
// const User = require("../models/User");
const { Op } = require("sequelize");
const { User, Group, GroupUser, Chat, GroupMessage } = require("../models/index")
// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, creatorId, members } = req.body;

    const group = await Group.create({ name });
    await GroupUser.create({
      groupId: group.id,
      userId: creatorId,
      isAdmin: true,
    });

    if (members.length > 0) {
      const memberData = members.map((userId) => ({
        groupId: group.id,
        userId,
      }));
      await GroupUser.bulkCreate(memberData);
    }

    res.json({ message: "Group created successfully!", group });
  } catch (error) {
    res.status(500).json({ error: "Error creating group" });
  }
};

// Add user to group (Admins only)
exports.addUser = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    await GroupUser.create({ groupId, userId });
    res.json();
  } catch (error) {
    res.status(500).json({ error: "Error adding user" });
  }
};

// Remove user from group (Admins only)
exports.removeUser = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    await GroupUser.destroy({ where: { groupId, userId } });
    res.json();
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ error: "Error removing user" });
  }
};

// Make Admin
exports.makeAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    await GroupUser.update({ isAdmin: true }, { where: { groupId, userId } });
    res.json();
  } catch (error) {
    res.status(500).json({ error: "Error assigning admin" });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    await GroupUser.destroy({ where: { groupId, userId } });

    const adminCount = await GroupUser.count({
      where: { groupId, isAdmin: true },
    });
    if (adminCount === 0) {
      const firstMember = await GroupUser.findOne({ where: { groupId } });
      if (firstMember) {
        await GroupUser.update(
          { isAdmin: true },
          { where: { groupId, userId: firstMember.userId } }
        );
      } else {
        await Group.destroy({ where: { id: groupId } });
      }
    }

    res.json();
  } catch (error) {
    res.status(500).json({ error: "Error leaving group" });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    await GroupMessage.destroy({ where: { groupId } });
    await GroupUser.destroy({ where: { groupId } });
    await Group.destroy({ where: { id: groupId } });

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting group" });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    const groups = await Group.findAll({
      include: [
        {
          model: GroupUser,
          where: { userId },
          attributes: ["isAdmin"],
          include: [
            {
              model: User,
              attributes: ["id", "name"], // Include user info
            },
          ],
        },
      ],
    });
    res.json({ groups });
  } catch (error) {
    console.error("Error fetching user groups:", error.message);
    res.status(500).json({ error: "Error fetching user groups" });
  }
};

exports.getGroupUsers = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Fetch all users in the group
    const groupUsers = await GroupUser.findAll({
      where: { groupId },
      include: [{ model: User, attributes: ["id", "name"] }],
    });

    const admins = groupUsers
      .filter((gu) => gu.isAdmin) // Filter out admins
      .map((admin) => admin.userId);
    // Extract user IDs from group users
    const groupUserIds = groupUsers.map((groupUser) => groupUser.userId);

    // Fetch all users NOT in the group
    const nonGroupUsers = await User.findAll({
      where: { id: { [Op.notIn]: groupUserIds } }, // Exclude users already in the group
      attributes: ["id", "name"],
    });

    // Format the response
    res.json({
      groupUsers: groupUsers.map((gu) => ({
        id: gu.User.id,
        name: gu.User.name,
        isAdmin: gu.isAdmin,
      })),
      nonGroupUsers,
      adminId: admins, // Users not in the group
    });
  } catch (error) {
    console.error("Error fetching group users:", error);
    res.status(500).json({ error: "Error fetching group users" });
  }
};