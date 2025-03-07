const express = require("express");
const { uploadFile, uploadMiddleware } = require('../controllers/uploadController');

const router = express.Router();

router.post("/" ,uploadMiddleware, uploadFile);

module.exports = router;