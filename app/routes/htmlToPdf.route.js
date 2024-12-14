const express = require("express");
const router = express.Router();
const { generatePdf, testPdf } = require("../controllers/pdfController");

router.get("/", testPdf);

router.post("/", generatePdf);

module.exports = router;