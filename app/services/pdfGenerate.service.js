const fs = require('fs');
const path = require("path");
const puppeteer = require('puppeteer');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

const { replacePlaceholders, tempData, tableData, getNestedValue } = require("../utils/htmlConfig.util");
const reqManagerService = require("../services/requestManager.service");

const { imageUrl } = require("../utils/htmlConfig.util");

const generatePdf = async (headerContent, bodyContent, footerContent) => {
    const defaultValues = { defVal: "-" };
    const margin = { top: "200px", bottom: "150px", left: "20px", right: "20px" };

    try {
        headerContent = replacePlaceholders(headerContent, tempData, defaultValues.defVal);
        bodyContent = replacePlaceholders(bodyContent, tempData, defaultValues.defVal);
        footerContent = replacePlaceholders(footerContent, tempData, defaultValues.defVal);

        headerContent = await replaceImagesWithBase64(headerContent);
        // bodyContent = await replaceImagesWithBase64(bodyContent);
        footerContent = await replaceImagesWithBase64(footerContent);

        bodyContent = `<html><body><div>${bodyContent}</div></body></html>`;
        const pdfBuffer = await convertHtmlToPdf(headerContent, bodyContent, footerContent, margin, true);

        return Buffer.from(pdfBuffer).toString("base64");
    } catch (error) {
        throw new Error("Error in generatePdf: " + error.message);
    }
};

const generatePdfWithData = async (headerContent, bodyContent, footerContent, options, userId) => {
    const {
        json = {},
        defVal = "-",
        displayHeaderFooter = true,
        margin = {},
        organization_id,
        name,
        htmlTables
    } = options;

    const defaultMargin = {
        top: margin.t ? margin.t + "px" : "200px",
        bottom: margin.b ? margin.b + "px" : "150px",
        left: margin.l ? margin.l + "px" : "20px",
        right: margin.r ? margin.r + "px" : "20px",
    };

    try {
        const tableTemplate = await generateTableHtmlV2(htmlTables, json, defVal) || [];
        for (const t of tableTemplate) {
            const placeholder = `{{${t.field_path}}}`;
            headerContent = headerContent.replace(new RegExp(placeholder, 'g'), t.tableTemplate);
            bodyContent = bodyContent.replace(new RegExp(placeholder, 'g'), t.tableTemplate);
            footerContent = footerContent.replace(new RegExp(placeholder, 'g'), t.tableTemplate);
        }

        headerContent = replacePlaceholders(headerContent, json, defVal);
        bodyContent = replacePlaceholders(bodyContent, json, defVal);
        footerContent = replacePlaceholders(footerContent, json, defVal);

        headerContent = await replaceImagesWithBase64(headerContent);
        // bodyContent = await replaceImagesWithBase64(bodyContent);
        footerContent = await replaceImagesWithBase64(footerContent);

        bodyContent = `<html><body><div>${bodyContent}</div></body></html>`;
        const pdfBuffer = await convertHtmlToPdf(headerContent, bodyContent, footerContent, defaultMargin, displayHeaderFooter);

        await reqManagerService.logRequest(organization_id, { name, userId });

        return Buffer.from(pdfBuffer).toString("base64");
    } catch (error) {
        throw new Error("Error in generatePdfWithDataService: " + error.message);
    }
};

const testPdf = async () => {
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
        </html>`;

    try {
        const pdfBuffer = await convertHtmlToPdf(htmlContent, null, null, {}, false);
        return Buffer.from(pdfBuffer).toString("base64");
    } catch (error) {
        throw new Error("Error in testPdfService: " + error.message);
    }
};

// Function to convert HTML content to PDF
const convertHtmlToPdf = async (headerWithBase64, bodyContent, footerWithBase64, margin,
    displayHeaderFooter
) => {
    try {
        const tempDir = path.resolve('./temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        // Generate a unique file name for the PDF
        const uniqueFileName = `${uuidv4()}.pdf`;
        const outputPath = path.resolve('./temp', uniqueFileName);
        // Launch Puppeteer browser instance
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true, // Ensure headless mode is enabled
        });
        const page = await browser.newPage();

        // Set the HTML content provided in the request
        await page.setContent(bodyContent, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('table'); // Ensure the table is loaded
        // await page.emulateMediaType('screen');
        // console.log(process.env.PDF_PATH)
        // Generate PDF with header and footer
        const pdfBuffer = await page.pdf({

            path: outputPath, // Path to save the PDF file path.resolve(outputPath)
            format: "A4",
            displayHeaderFooter: Boolean(displayHeaderFooter),
            headerTemplate: headerWithBase64,
            footerTemplate: footerWithBase64,
            margin: {
                top: margin.top || "200px",
                bottom: margin.bottom || "150px",
                left: margin.left || "20px",
                right: margin.right || "20px",
            },
            printBackground: true,
        });

        await browser.close();
        // Read the PDF file into a buffer
        // const pdfBuffer = fs.readFileSync(outputPath);

        // Remove the temporary PDF file after reading it
        fs.unlinkSync(outputPath);
        return pdfBuffer;
    } catch (error) {
        throw new Error("Failed to convert HTML to PDF: " + error.message);
    }
};

const replaceImagesWithBase64 = async (htmlContent) => {
    // Regular expression to find img tags and their src attributes
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;

    // Find all the image URLs
    const imageUrls = [...htmlContent.matchAll(imgRegex)];

    for (const match of imageUrls) {
        const imageUrl = match[1];
        try {
            const base64Image = await convertToBase64(imageUrl);
            htmlContent = htmlContent.replace(imageUrl, base64Image); // Replace the image src with the base64 string
        } catch (error) {
            console.error('Error converting image to base64:', error);
        }
    }

    return htmlContent;
};


const convertToBase64 = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let chunks = [];
            res.on("data", (chunk) => {
                chunks.push(chunk);
            });
            res.on("end", () => {
                const buffer = Buffer.concat(chunks);
                const base64Image = `data:${res.headers["content-type"]};base64,${buffer.toString("base64")}`;
                resolve(base64Image);
            });
            res.on("error", (err) => {
                reject(err);
            });
        });
    });
};

const convertTestPdf = async (htmlContent) => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-gpu"],
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
        if (["image", "stylesheet", "font"].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({
        path: "output.pdf",
        format: "A4",
        displayHeaderFooter: true, // Enable header and footer
        headerTemplate: `
            <div style="font-size: 10px; text-align: center; width: 100%;">
                <img src="${await convertToBase64(
            imageUrl
        )}" style="height: 30px;" />
                <span>Custom Header - Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            </div>
        `,
        footerTemplate: `
            <div style="font-size: 10px; text-align: center; width: 100%; border-top: 1px solid #ccc; padding-top: 5px;">
            <img src="${await convertToBase64(
            imageUrl
        )}" style="height: 30px;" />
                <span>Custom Footer - Page <span class="pageNumber"></span> of <span class="totalPages">
                </span></span>
            </div>
        `,
        margin: {
            top: "80px", // Adjust to fit the header
            bottom: "80px", // Adjust to fit the footer
            left: "20px",
            right: "20px",
        },
    });

    await browser.close();
    return pdfBuffer;
};

const generateTableHtml = (tableData) => {
    const { rows, cellStyles, customHtml, numColumns } = tableData;

    const tableBody = rows.map((row, rowIndex) => {
        return `
        <tr style="background-color: ${cellStyles[rowIndex]?.backgroundColor};">
            ${Array.from({ length: numColumns }).map((_, colIndex) => {
            return `
                <td style="background-color: ${cellStyles[colIndex].backgroundColor}; font-size: ${cellStyles[colIndex].fontSize}; padding: ${cellStyles[colIndex].padding}; color: ${cellStyles[colIndex].color}; border: 1px solid #ddd; text-align: left;">
                    ${row[`col${colIndex + 1}`] || ""}
                </td>`;
        }).join("")}
        </tr>`;
    }).join("");

    const tableTemplate = customHtml.replace("<tbody></tbody>", `<tbody>${tableBody}</tbody>`);
    return tableTemplate;
};

const generateTableHtmlV2 = async (tableData = [], json = {}, defVal) => {
    const processedTables = await tableData?.map(table => {
        const { id, name, num_columns, col_keys, tag, table_rows, cell_styles, custom_html } = table;

        const fieldPath = tag.field_path.split('._table_')[0];
        const value = getNestedValue(json, fieldPath);
        const rows = Array.isArray(value) ? value : [];
        // 
        const tableBody = rows.map((row, rowIndex) => {
            return `
        <tr>
            ${Array.from({ length: num_columns }).map((_, colIndex) => {
                return `
                <td style="background-color:${cell_styles[colIndex].backgroundColor};
                font-size: ${cell_styles[colIndex].fontSize}; padding: ${cell_styles[colIndex].padding}; 
                color: ${cell_styles[colIndex].color}; border: 1px solid #ddd; text-align: left;">
                ${getNestedValue(row, col_keys[`col_key${colIndex + 1}`]) || defVal}
                </td>`;
            }).join("")}
        </tr>`;
        }).join("");

        const tableTemplate = custom_html.replace("<tbody></tbody>", `<tbody>${tableBody}</tbody>`);
        return { tableTemplate, field_path: tag.field_path };
    });

    return processedTables;
};

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
    generatePdfWithData,
    testPdf,
    convertHtmlToPdf,
    replaceImagesWithBase64,
    convertToBase64,
    convertTestPdf,
    generateTableHtml
}