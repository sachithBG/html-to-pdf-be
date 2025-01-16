const pdfService = require('../services/pdfManage.service');
const reqManagerService = require("../services/requestManager.service");
const pdfGenerateService = require("../services/pdfGenerate.service");
const { getTagsByAddonAndType } = require('../repositories/tagManage.repository');
const { getHtmlTablesByTagIds } = require('../repositories/dynamicHtmlTable.repository');

const savePdf = async (req, res) => {
    try {
        const { name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter, defVal, organization_id, addon_ids, external_key } = req.body;

        // Basic validation
        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }
        if (!bodyContent) {
            return res.status(400).json({ error: 'Body content are required.' });
        }
        if (displayHeaderFooter && !headerContent || !footerContent) {
            return res.status(400).json({ error: 'Header and footer content are required.' });
        }
        if (!external_key) {
            return res.status(400).json({ error: 'Type/Status is required.' });
        }
        // Call service to save PDF
        const pdf = await pdfService.savePdf(name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter, defVal,
            organization_id, addon_ids, external_key);

        res.status(201).json({
            message: 'PDF saved successfully!',
            data: pdf,
        });
    } catch (error) {
        console.error('Error saving PDF:', error);
        res.status(500).json({
            error: 'An error occurred while saving the PDF.',
            details: error.message,
        });
    }
};

const updatePdf = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter, defVal, organization_id,
            addon_ids, external_key } = req.body;

        // Basic validation
        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }
        if (!bodyContent) {
            return res.status(400).json({ error: 'Body content are required.' });
        }
        if (displayHeaderFooter && !headerContent || !footerContent) {
            return res.status(400).json({ error: 'Header and footer content are required.' });
        }
        if (!external_key) {
            return res.status(400).json({ error: 'Type/Status is required.' });
        }
        // Call service to update PDF
        const updatedPdf = await pdfService.updatePdf(id, name, headerContent, bodyContent, footerContent, json,
            margin, displayHeaderFooter, defVal, organization_id, addon_ids, external_key);

        res.status(200).json({
            message: 'PDF updated successfully!',
            data: updatedPdf,
        });
    } catch (error) {
        console.error('Error updating PDF:', error);
        res.status(500).json({
            error: 'An error occurred while updating the PDF.',
            details: error.message,
        });
    }
};

const updateDummyData = async (req, res) => {
    try {
        const { id } = req.params;
        let { json } = req.body;
        // Basic validation
        if (!json) {
            return res.status(400).json({ error: 'data is required.' });
        }
        json = JSON.parse(json);
        // Call service to update PDF
        const updatedPdf = await pdfService.updateDummyData(id, json);

        res.status(200).json({
            message: 'PDF updated successfully!',
            data: updatedPdf,
        });
    } catch (error) {
        console.error('Error updating PDF:', error);
        res.status(500).json({
            error: 'An error occurred while updating the PDF.',
            details: error.message,
        });
    }
};

const getPdfById = async (req, res) => {
    try {
        const { id } = req.params;

        // Call service to get PDF by ID
        const pdf = await pdfService.getPdfById(id);

        res.status(200).json({
            message: 'PDF retrieved successfully!',
            data: pdf,
        });
    } catch (error) {
        console.error('Error retrieving PDF:', error);
        res.status(500).json({
            error: 'An error occurred while retrieving the PDF.',
            details: error.message,
        });
    }
};

// New method to get PDF by name
const getPdfByName = async (req, res) => {
    try {
        const { name } = req.params;

        // Basic validation
        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }

        // Call service to get PDF by name
        const pdf = await pdfService.getPdfByName(name);

        if (!pdf) {
            return res.status(404).json({
                error: 'PDF not found with the provided name.',
            });
        }

        res.status(200).json({
            message: 'PDF retrieved successfully!',
            data: pdf,
        });
    } catch (error) {
        console.error('Error retrieving PDF by name:', error);
        res.status(500).json({
            error: 'An error occurred while retrieving the PDF by name.',
            details: error.message,
        });
    }
};

const getDataAsPage = async (req, res) => {
    try {
        const { sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id } = req.query;
        if (!organization_id) {
            return res.status(404).json({
                error: 'Organization id required',
            });
        }
        // Call service to get paginated data
        const data = await pdfService.getDataAsPage(sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id);

        res.status(200).json({
            message: 'Data fetched successfully!',
            data,
        });
    } catch (error) {
        console.error('Error fetching paginated data:', error);
        res.status(500).json({
            error: 'An error occurred while fetching the data.',
            details: error.message,
        });
    }
};

const deletePdf = async (req, res) => {
    try {
        const { id } = req.params;

        // Call service to delete PDF
        const result = await pdfService.deletePdf(id);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting PDF:', error);
        res.status(500).json({
            error: 'An error occurred while deleting the PDF.',
            details: error.message,
        });
    }
};

const getTemplateByExternalKeyAndAddon = async (req, res) => {
    try {
        const { externalKey, addonName } = req.query; // Assuming query parameters are used
        if (!externalKey || !addonName) {
            return res.status(400).json({ message: 'Missing externalKey or addonName.' });
        }

        const template = await pdfService.getTemplateByExternalKeyAndAddon(externalKey, addonName);
        res.status(200).json(template);
    } catch (error) {
        console.error('Error fetching template by external key and addon name:', error);
        res.status(500).json({ message: 'Failed to fetch template.' });
    }
};

const pdfPreview = async (req, res) => {
    const { id } = req.params;
    const { organization_id } = req.query;
    try {
        // Fetch template by ID
        const template = await pdfService.getPdfById(id);
        if (!template) {
            return res.status(404).json({ message: "Template not found." });
        }
        // Prepare options for PDF generation
        const options = {
            json: JSON.parse(template.json || {}),
            defVal: template.defVal || "-",
            displayHeaderFooter: template.displayHeaderFooter !== undefined ? template.displayHeaderFooter : true,
            margin: {
                t: template.margin?.t || 200,
                b: template.margin?.b || 150,
                l: template.margin?.l || 20,
                r: template.margin?.r || 20,
            },
            organization_id: Number(organization_id),
            name: template.name,
        };
        if (template.addons) {
            const tags = await getTagsByAddonAndType(template.addons.map(a => a.id), 'TABLE');
            if (!tags || tags.length === 0) {
                console.error("No tags found for the provided criteria.");
                // throw new Error("No tags found for the provided criteria.");
            } else {
                const htmlTables = await getHtmlTablesByTagIds(tags.map((tag) => tag.id));
                if (htmlTables) {
                    options.htmlTables = htmlTables.map(table => {
                        const tag = tags.find(tag => tag.id === table.tag_id);
                        return { ...table, tag };
                    });
                }
            }
        }
        // Generate PDF
        const pdfBuffer = await pdfGenerateService.generatePdfWithData(template.headerContent,
            template.bodyContent, template.footerContent, options, req.user.userId);

        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader("Content-Disposition", `attachment; filename=${template.name}.pdf`);
        res.json({ pdf: pdfBuffer });
    } catch (error) {
        console.error("Error in convertById:", error);
        res.status(500).json({ message: "Failed to generate PDF." });
    }
}

module.exports = {
    savePdf,
    updatePdf,
    getPdfById,
    getPdfByName,
    getDataAsPage,
    deletePdf,
    getTemplateByExternalKeyAndAddon,
    updateDummyData,
    pdfPreview
}