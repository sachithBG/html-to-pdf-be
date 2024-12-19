const express = require("express");
const router = express.Router();

// Import the controller methods
const { generatePdfWithData, getPdfByName } = require('../controllers/pdfManage.controller');
const validateRefreshToken = require("../middleware/auth2");

router.post("/convert", validateRefreshToken, generatePdfWithData);


module.exports = router;