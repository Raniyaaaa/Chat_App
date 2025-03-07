const express = require("express");
const { archiveOldMessages } = require("../controllers/archiveController");

const router = express.Router();

// Manually trigger chat archiving
router.post("/", archiveOldMessages);

module.exports = router;
