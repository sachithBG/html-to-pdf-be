const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

// Import the controller methods
const { savePdf, updatePdf, getPdfById, getDataAsPage, deletePdf, testPdf, generatePdfWithData, getPdfByName,
    getTemplateByExternalKeyAndAddon } = require('../controllers/pdfManage.controller');

// Define routes and link them with corresponding controller methods
router.post("/resource", authenticateToken, savePdf);         // Save new PDF
router.put("/resource/:id", authenticateToken, updatePdf);    // Update existing PDF by ID
router.get("/resource/:id", authenticateToken, getPdfById);            // Get PDF by ID
router.get("/name/:name", authenticateToken, getPdfByName);            // Get PDF by ID
router.get("/template/page", authenticateToken, getDataAsPage);            // Get paginated list of PDFs (with sorting and filtering)
router.delete("/resource/:id", authenticateToken, deletePdf);         // Delete a PDF by ID

router.get('/template-by-key-addon', authenticateToken, getTemplateByExternalKeyAndAddon);
router.post("/convert", authenticateToken, generatePdfWithData);

router.post("/test", testPdf);

module.exports = router;