const fs = require('fs');
const path = require("path");
const puppeteer = require('puppeteer');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const { decode } = require('entities');

const { replacePlaceholders, tempData, tableData, getNestedValue, setStyles, setStyles2 } = require("../utils/htmlConfig.util");
const reqManagerService = require("../services/requestManager.service");

const { imageUrl } = require("../utils/htmlConfig.util");

const ckeditorStyles = fs.readFileSync(
    path.resolve(__dirname, '../css/ckeditor5.css'),
    'utf8'
);

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

        // bodyContent = `<html><body><div>${bodyContent}</div></body></html>`;
        const pdfBuffer = await convertHtmlToPdf(headerContent, bodyContent, footerContent, margin, true);

        return Buffer.from(pdfBuffer).toString("base64");
    } catch (error) {
        throw new Error("Error in generatePdf: " + error.message);
    }
};

const generatePdfWithDataV1 = async (headerContent, bodyContent, sections = [], footerContent, options, userId,
    subcategoriesFilter = [], allowAllSections = true) => {
    let newBodyContent = bodyContent;
    for (sec of sections) {
        const { htmlContent, subcategories } = sec;
        if (subcategoriesFilter.some((filter) => subcategories.includes(filter)) || allowAllSections) {
            newBodyContent += htmlContent;
        }
    }
    return await generatePdfWithData(headerContent, newBodyContent, footerContent, options, userId);
}

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

        // bodyContent = setStyles(bodyContent, ckeditorStyles);
        // headerContent = setStyles(headerContent, ckeditorStyles);
        // headerContent = `<div class="ck ck-content">
        //                 ${headerContent} 
        //             </div>`;


        // headerContent = await replaceImagesWithBase64(decodeHTMLEntities(headerContent));
        // bodyContent = await replaceImagesWithBase64(decodeHTMLEntities(bodyContent));
        // footerContent = await replaceImagesWithBase64(decodeHTMLEntities(footerContent));

        // bodyContent = `<html><body><div>${bodyContent}</div></body></html>`;
        const pdfBuffer = await convertHtmlToPdf(headerContent, bodyContent, footerContent, defaultMargin, displayHeaderFooter);

        await reqManagerService.logRequest(organization_id, { name, userId });

        return Buffer.from(pdfBuffer).toString("base64");
    } catch (error) {
        throw new Error("Error in generatePdfWithDataService: " + error.message);
    }
};

const testPdf = async (headerContent, bodyContent, footerContent, margin) => {

    try {

        // headerContent = await replaceImagesWithBase64(decodeHTMLEntities(headerContent));
        // bodyContent = await replaceImagesWithBase64(decodeHTMLEntities(bodyContent));
        // footerContent = await replaceImagesWithBase64(decodeHTMLEntities(footerContent));
        // bodyContent = setStyles(bodyContent, ckeditorStyles);
        // bodyContent = `<html><body><div>${bodyContent}</div></body></html>`;
        const pdfBuffer = await convertHtmlToPdf(headerContent, bodyContent, footerContent, margin, true);
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
        margin = {
            top: margin.top || "200px",
            bottom: margin.bottom || "150px",
            left: margin.left || "20px",
            right: margin.right || "20px",
        };
        // headerWithBase64 = setStyles(headerWithBase64, ckeditorStyles);
        bodyContent = setStyles(bodyContent, ckeditorStyles);
        headerWithBase64 = setStyles2(headerWithBase64, ckeditorStyles, margin);
        footerWithBase64 = setStyles2(footerWithBase64, ckeditorStyles, margin);
        // footerWithBase64 = setStyles(footerWithBase64, ckeditorStyles);

        headerWithBase64 = await replaceImagesWithBase64(decodeHTMLEntities(headerWithBase64));
        // headerWithBase64 = await replaceImagesWithBase64(decodeHTMLEntities(wrapContent(headerWithBase64, margin)));
        bodyContent = await replaceImagesWithBase64(decodeHTMLEntities(bodyContent));
        footerWithBase64 = await replaceImagesWithBase64(decodeHTMLEntities(footerWithBase64));
        // footerWithBase64 = await replaceImagesWithBase64(decodeHTMLEntities(wrapContent(footerWithBase64, margin)));
        
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
        if (bodyContent?.includes('<table')) await page.waitForSelector('table'); // Ensure the table is loaded
        if (bodyContent?.includes('<img')) await page.waitForSelector('img'); // Ensure the table is loaded
        if (bodyContent?.includes('<p')) await page.waitForSelector('p'); // Ensure the table is loaded

        await page.addStyleTag({ path: './app/css/ckeditor5.css' });
        // await page.isJavaScriptEnabled(true);
        // await delay(2000);
        // await page.addStyleTag({ url: 'https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css' });
        // await page.emulateMediaType('screen');
        // console.log(process.env.PDF_PATH)
        // Generate PDF with header and footer
        const pdfBuffer = await page.pdf({
            path: outputPath, // Path to save the PDF file path.resolve(outputPath)
            format: "A4",
            displayHeaderFooter: Boolean(displayHeaderFooter),
            headerTemplate: headerWithBase64,
            footerTemplate: footerWithBase64,
            margin: margin,
            printBackground: true,
            waitForFonts: true,
        });

        await browser.close();
        // Read the PDF file into a buffer
        // const pdfBuffer = fs.readFileSync(outputPath);
        fs.unlinkSync(outputPath);
        return pdfBuffer;
    } catch (error) {
        throw new Error("Failed to convert HTML to PDF: " + error.message);
    } finally {
        // Remove the temporary PDF file after reading it

    }
};

const replaceImagesWithBase64 = async (htmlContent) => {
    if (!htmlContent) return htmlContent;
    // Regular expression to find img tags and their src attributes
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;
    // const imageRegex = /<figure class="image[^>]*>.*?<img[^>]*src="([^">]+)"[^>]*>.*?<\/figure>/g;

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

const decodeHTMLEntities = (html) => decode(html);

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
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const wrapContent = (content, margin) => {
    // <div style="width: 794px;margin-left: ${margin.left}; margin-right: ${margin.right};padding: 0;color: #333;font-size: 12px;line-height: 0.1;" className="ck ck-editor__main">
    // return content;
    // <div class="ck ck-content" style="width: '100%';">
    // </div>
    return `<div className="ck ck-editor__main">
  <div class="ck ck-content" style="font-size: 12px; width: 100%;
  margin-left: ${margin.left}; margin-right: ${margin.right};">
    ${content}
  </div>
  </div>
`;
};

const headerHTML = `
  <div class="ck ck-content" style="font-size: 12px; width: 100%; text-align: center; padding: 10px 0; border-bottom: 1px solid #ddd;">
    <span style="font-weight: bold;">Document Title</span>
    <span style="float: right;">{{date}}</span>
  </div>
`;

const footerHTML = `
  <div class="ck ck-content" style="font-size: 12px; width: 100%; text-align: center; padding: 10px 0; border-top: 1px solid #ddd;">
    <span>Page {{pageNumber}} of {{totalPages}}</span>
  </div>
`;
module.exports = {
    generatePdf,
    generatePdfWithData,
    generatePdfWithDataV1,
    testPdf,
    convertHtmlToPdf,
    replaceImagesWithBase64,
    convertToBase64,
    generateTableHtml
}