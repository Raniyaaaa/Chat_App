const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require('./utils/database');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
    app.listen(8000, () => console.log("Server running on port 8080"));
  })
  .catch((err) => console.error("Database sync error:", err));