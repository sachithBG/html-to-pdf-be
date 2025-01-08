const express = require('express');
const requestManagerController = require('../controllers/requestManager.controller');

const router = express.Router();
const authenticateToken = require("../middleware/auth");

router.get('/chart-data/monthly', authenticateToken, requestManagerController.getMonthlyPdfRequestData);

module.exports = router;