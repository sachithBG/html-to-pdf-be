const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
    createHtmlTable,
    updateHtmlTable,
    getHtmlTables,
    getHtmlTableById,
    deleteHtmlTable,
    getDataAsPage
} = require('../controllers/dynamicHtmlTable.controller');

// Validation rules (optional, depending on your needs)
// For example, validating table data like name, rows, etc. using express-validator can be added.

router.post("/", authenticateToken, createHtmlTable); // Create new HTML table
router.put("/:id", authenticateToken, updateHtmlTable); // Update HTML table
router.get("/", authenticateToken, getHtmlTables); // Get all HTML tables
router.get("/page", authenticateToken, getDataAsPage);
router.get("/:id", authenticateToken, getHtmlTableById); // Get HTML table by ID
router.delete("/:id", authenticateToken, deleteHtmlTable); // Delete HTML table

module.exports = router;
