const { getTemplateById, getTemplateByAddon } = require("../services/pdfManage.service");
const { findAddonByName } = require("../services/addonManage.service");
const pdfGenerateService = require("../services/pdfGenerate.service");
const { getExternalKeyByKeyValue } = require("../services/externalKey.service");

// Generate PDF by template ID
const convertById = async (req, res) => {
    const { id } = req.params;
    const { jsonData, subcategoriesFilter, allowAllSections } = req.body;

    try {
        // Fetch template by ID
        const template = await getTemplateById(id);
        if (!template) {
            return res.status(404).json({ message: "Template not found." });
        }
        // Prepare options for PDF generation
        const options = {
            json: jsonData,
            defVal: template.defVal || "-",
            displayHeaderFooter: template.displayHeaderFooter !== undefined ? template.displayHeaderFooter : true,
            margin: {
                t: template.margin?.t || 200,
                b: template.margin?.b || 150,
                l: template.margin?.l || 20,
                r: template.margin?.r || 20,
            },
            organization_id: req.user.organizationId,
            name: template.name,
        };
        // Generate PDF
        const pdfBuffer = await pdfGenerateService.generatePdfWithDataV1(template.header_content,
            template.body_content, template.footer_content, options, req.user.userId, subcategoriesFilter, allowAllSections);

        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader("Content-Disposition", `attachment; filename=${template.name}.pdf`);
        res.json({ pdf: pdfBuffer });
    } catch (error) {
        console.error("Error in convertById:", error);
        res.status(500).json({ message: "Failed to generate PDF." });
    }
};

// Generate PDF by Addon ID and type/status
const convertByAddon = async (req, res) => {
    const { addonName, typeStatus, subcategoriesFilter, jsonData, allowAllSections } = req.body;

    try {
        // Find addon by name
        const addon = await findAddonByName(req.user.organizationId, addonName);
        if (!addon) {
            return res.status(404).json({ message: "Addon not found." });
        }

        // Find addon by name
        const KeyValue = await getExternalKeyByKeyValue(typeStatus);
        if (!KeyValue) {
            return res.status(404).json({ message: "Type/Status not found." });
        }

        // Fetch template by addon ID and type/status
        const template = await getTemplateByAddon(addon.id, KeyValue.id);
        if (!template) {
            return res.status(404).json({ message: "Template not found for the specified addon and type/status." });
        }
        const options = {
            json: jsonData,
            defVal: template.defVal || "-",
            displayHeaderFooter: template.displayHeaderFooter !== undefined ? template.displayHeaderFooter : true,
            margin: {
                t: template.margin?.t || 200,
                b: template.margin?.b || 150,
                l: template.margin?.l || 20,
                r: template.margin?.r || 20,
            },
            organization_id: req.user.organizationId,
            name: template.name,
        };
        // Generate PDF
        const pdfBuffer = await pdfGenerateService.generatePdfWithDataV1(template.header_content,
            template.body_content, template.footer_content, options, req.user.userId, subcategoriesFilter, allowAllSections);

        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader("Content-Disposition", `attachment; filename=${template.name}.pdf`);
        res.json({ pdf: pdfBuffer });
    } catch (error) {
        console.error("Error in convertByAddon:", error);
        res.status(500).json({ message: "Failed to generate PDF." });
    }
};

// Generate PDF with provided HTML content
const generatePdf = async (req, res) => {
    const { headerContent, bodyContent, footerContent } = req.body;

    if (!bodyContent) {
        return res.status(400).json({ error: "HTML content is required" });
    }

    try {
        const pdfResult = await pdfGenerateService.generatePdf(
            headerContent,
            bodyContent,
            footerContent
        );
        res.json({ message: "PDF generated successfully!", pdf: pdfResult });
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
};

// Generate PDF with data (JSON, defVal, etc.)
const generatePdfWithData = async (req, res) => {
    const { headerContent, bodyContent, footerContent, ...options } = req.body;

    if (!bodyContent) {
        return res.status(400).json({ error: "HTML content is required" });
    }

    try {
        const pdfResult = await pdfGenerateService.generatePdfWithData(
            headerContent,
            bodyContent,
            footerContent,
            options,
            req.user.id
        );
        res.json({ message: "PDF generated successfully!", pdf: pdfResult });
    } catch (error) {
        console.error("Error generating PDF with data:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
};

// Test PDF generation with predefined content
const testPdf = async (req, res) => {
    try {
        const data = await pdfGenerateService.testPdf();
        res.json({ pdf: data });
    } catch (error) {
        console.error("Error generating test PDF:", error);
        res.status(500).json({ version: "v1", error: "Failed to generate test PDF" });
    }
};

module.exports = {
    convertById,
    convertByAddon,
    generatePdfWithData,
    testPdf
};
