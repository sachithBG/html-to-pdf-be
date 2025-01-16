const express = require("express");
const router = express.Router();

// Import the controller methods
const { convertById, convertByAddon } = require('../controllers/pdfGenerate.controller');
const validateRefreshToken = require("../middleware/auth2");

router.post("/convert/by-addon", validateRefreshToken, convertByAddon);
router.post("/convert/:id", validateRefreshToken, convertById);


module.exports = router;