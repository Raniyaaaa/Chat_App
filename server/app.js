const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require('./utils/database');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const groupChatRoutes = require('./routes/groupChatRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const archiveRoutes = require('./routes/archiveRoutes');
require("./cron/archiveCron");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupRoutes);
app.use("/groupChat", groupChatRoutes);
app.use("/users", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/archive", archiveRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
    app.listen(8000, () => console.log("Server running on port 8080"));
  })
  .catch((err) => console.error("Database sync error:", err));