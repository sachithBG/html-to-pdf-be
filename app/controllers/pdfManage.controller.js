
const { convertHtmlToPdf, convertTestPdf, replaceImagesWithBase64 } = require("../services/pdfManage.service");
const { imageUrl, replacePlaceholders, tempData, tableData } = require("../utils/htmlConfig.util");

const pdfService = require('../services/pdfManage.service');
const reqManagerService = require("../services/requestManager.service");

const savePdf = async (req, res) => {
    try {
        const { name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter, defVal, organization_id, addon_ids } = req.body;

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

        // Call service to save PDF
        const pdf = await pdfService.savePdf(name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter, defVal, organization_id, addon_ids);

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
        const { name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter, defVal, organization_id, addon_ids } = req.body;

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

        // Call service to update PDF
        const updatedPdf = await pdfService.updatePdf(id, name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter, defVal, organization_id, addon_ids);

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

const generatePdf = async (req, res) => {
    let { headerContent, bodyContent, footerContent } = req.body; // Get HTML content from the request body

    if (!bodyContent) {
        return res.status(400).json({ error: "HTML content is required" });
    }
    try {
        const defVal = '-';
        margin = { top: "200px", bottom: "150px", left: "20px", right: "20px" };
        headerContent = replacePlaceholders(headerContent, tempData, defVal);
        bodyContent = replacePlaceholders(bodyContent, tempData, defVal);
        footerContent = replacePlaceholders(footerContent, tempData, defVal);

        headerContent = await replaceImagesWithBase64(headerContent);
        // bodyContent = await replaceImagesWithBase64(bodyContent);
        footerContent = await replaceImagesWithBase64(footerContent);

        bodyContent = `<html><body><div>${bodyContent}</div></body></html>`;

        console.log("Generating PDF...");
        const pdfBuffer = await convertHtmlToPdf(headerContent, bodyContent, footerContent, margin, true);

        // Send the generated PDF as a base64 string or as a buffer
        const base64Pdf = await Buffer.from(pdfBuffer).toString("base64");
        // console.log(base64Pdf)
        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
        res.json({ message: "PDF generated successfully!", pdf: base64Pdf });
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
};

const generatePdfWithData = async (req, res) => {
    let { headerContent, bodyContent, footerContent, json, defVal, displayHeaderFooter,
        margin, organization_id, name
    } = req.body; // Get HTML content from the request body

    if (!bodyContent) {
        return res.status(400).json({ error: "HTML content is required" });
    }
    const userId = req.user.id; // Assuming `req.user` contains authenticated user info
    // const metadata = req.body; // Extract metadata about the request (e.g., template or parameters)
    try {
        // Apply defaults to missing fields
        json = json || {}; // Set default to empty object if not provided
        defVal = defVal || '-'; // Default value for defVal if not provided
        displayHeaderFooter = displayHeaderFooter !== undefined ? displayHeaderFooter : true; // Default true if not provided

        // Default margin if not provided
        margin = margin || {};
        margin.top = margin.t ? margin.t + 'px' : "200px"; // Ensure margin.top is set and add 'px'
        margin.bottom = margin.b ? margin.b + 'px' : "150px"; // Ensure margin.bottom is set and add 'px'
        margin.left = margin.l ? margin.l + 'px' : "20px"; // Ensure margin.left is set and add 'px'
        margin.right = margin.r ? margin.r + 'px' : "20px"; // Ensure margin.right is set and add 'px'

        // Build the final margin object with proper units
        margin = {
            top: margin.top,
            bottom: margin.bottom,
            left: margin.left,
            right: margin.right,
        };
        headerContent = replacePlaceholders(headerContent, json, defVal);
        bodyContent = replacePlaceholders(bodyContent, json, defVal);
        footerContent = replacePlaceholders(footerContent, json, defVal);

        headerContent = await replaceImagesWithBase64(headerContent);
        // bodyContent = await replaceImagesWithBase64(bodyContent);
        footerContent = await replaceImagesWithBase64(footerContent);

        bodyContent = `<html><body><div>${bodyContent}</div></body></html>`;

        console.log("Generating PDF...");
        const pdfBuffer = await convertHtmlToPdf(headerContent, bodyContent, footerContent, margin, displayHeaderFooter == 1);

        // Send the generated PDF as a base64 string or as a buffer
        const base64Pdf = await Buffer.from(pdfBuffer).toString("base64");
        // console.log(base64Pdf)
        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
        res.json({ message: "PDF generated successfully!", pdf: base64Pdf });
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    } finally {
        try {
            // Log the request
            await reqManagerService.logRequest(organization_id, { name, userId });
        } catch (e) {
            console.error("Error logging PDF request:", error);
        }

    }
}

const testPdf = async (req, res) => {
    try {
        console.log("requested");

        const htmlContent = `
        <html>
            <body>
                <h1 style="font-family: Arial, sans-serif; color: #333;">HTML to PDF Conversion</h1>
                <p style="font-family: Arial, sans-serif; color: #555;">
                    This is the main content of the PDF.
                </p>
                <p style="font-family: Arial, sans-serif; color: #555;">
                    The header and footer are consistent on every page, including images.
                </p>
                <img src="${imageUrl}" style="height: 300px; margin-bottom: 20px;" />

                <!-- First Table Title -->
                <h2 style="font-family: 'Georgia', serif; font-weight: bold; font-size: 18px; margin-bottom: 10px;">
                    First Table: Sample Data
                </h2>

                <!-- First Table -->
                <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #4CAF50; color: white; padding: 10px;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Header 1</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Header 2</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Header 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background-color: #f2f2f2;">
                            <td style="padding: 8px; border: 1px solid #ddd;">Row 1, Column 1</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">Row 1, Column 2</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">Row 1, Column 3</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">Row 2, Column 1</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">Row 2, Column 2</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">Row 2, Column 3</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Second Table Title -->
                <h2 style="font-family: 'Georgia', serif; font-weight: bold; font-size: 18px; margin-bottom: 10px;">
                    Second Table: 50 Rows of Data
                </h2>

                <!-- Second Table with 50 Rows -->
                <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; page-break-before: always;">
                    <thead>
                        <tr style="background-color: #4CAF50; color: white; padding: 10px;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Row Number</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Description</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Array.from({ length: 50 })
                .map((_, i) => `
                                <tr style="${i % 2 === 0 ? 'background-color: #f2f2f2;' : ''}">
                                    <td style="padding: 8px; border: 1px solid #ddd;">Row ${i + 1}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">Description for Row ${i + 1}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">Details for Row ${i + 1}</td>
                                </tr>
                            `)
                .join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `
        // Generate PDF with header and footer
        const data = await convertTestPdf(htmlContent);
        res.json({ pdf: await Buffer.from(data).toString("base64") });

    } catch (e) {
        res.status(500).json({
            version: "v1",
            message: e,
        });
        console.log(e);
    }
}

function generateTableBody(tableData) {
    return tableData.map(row => {
        return `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${row.metric}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${row.target}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${row.achieved}</td>
      </tr>
    `;
    }).join('');
}

const tableTemplate = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
      <thead>
        <tr style="background-color: #f4f4f4;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Metric</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Target</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Achieved</th>
        </tr>
      </thead>
      <tbody>
        <!-- Table body will be dynamically inserted here -->
      </tbody>
    </table>
  `;

const generatedTableBody = generateTableBody(tableData);
const updatedTable = tableTemplate.replace('<tbody><!-- Table body will be dynamically inserted here --></tbody>', `<tbody>${generatedTableBody}</tbody>`);

module.exports = {
    savePdf,
    updatePdf,
    getPdfById,
    getPdfByName,
    getDataAsPage,
    deletePdf,
    generatePdf,
    testPdf,
    generatePdfWithData,

}