const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token.controller');
const authenticateToken = require("../middleware/auth");

// Route to generate access and refresh tokens
router.post('/generate', authenticateToken, tokenController.generateTokens);

module.exports = router;
