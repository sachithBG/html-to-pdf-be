
const { convertHtmlToPdf, convertTestPdf, replaceImagesWithBase64 } = require("../services/pdfService");
const { imageUrl, replacePlaceholders, tempData, tableData } = require("../utils/htmlConfig.util");

const generatePdf = async (req, res) => {
    let { headerContent, bodyContent, footerContent } = req.body; // Get HTML content from the request body

    if (!bodyContent) {
        return res.status(400).json({ error: "HTML content is required" });
    }
    try {
        const defVal = '-';
        headerContent = replacePlaceholders(headerContent, tempData, defVal);
        bodyContent = replacePlaceholders(bodyContent, tempData, defVal);
        footerContent = replacePlaceholders(footerContent, tempData, defVal);

        headerContent = await replaceImagesWithBase64(headerContent);
        // bodyContent = await replaceImagesWithBase64(bodyContent);
        footerContent = await replaceImagesWithBase64(footerContent);

        bodyContent = `<html><body><div>${bodyContent}</div></body></html>`;

        console.log("Generating PDF...");
        const pdfBuffer = await convertHtmlToPdf(headerContent, bodyContent, footerContent);

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

const testPdf = async (req, res) => {
    try {
        console.log("requested");

        const htmlCOntent = `
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
        await convertTestPdf(htmlCOntent);
        res.json('ok');

    } catch (e) {
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
    generatePdf,
    testPdf
}