const express = require("express");
const router = express.Router();
const https = require('https');
const path = require("path");

const puppeteer = require('puppeteer');

router.get("/", async (req, res) => {
    try {
        console.log("requested");

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu'] });
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });
        let img = await convertToBase64(imageUrl);
        // Load your main content HTML
        // 
        await page.setContent(`
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
    `);
//
    // Generate PDF with header and footer
    await page.pdf({
        path: 'output.pdf',
        format: 'A4',
        displayHeaderFooter: true, // Enable header and footer
        headerTemplate: `
            <div style="font-size: 10px; text-align: center; width: 100%;">
                <img src="${await convertToBase64(imageUrl)}" style="height: 30px;" />
                <span>Custom Header - Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            </div>
        `,
        footerTemplate: `
            <div style="font-size: 10px; text-align: center; width: 100%; border-top: 1px solid #ccc; padding-top: 5px;">
            <img src="${await convertToBase64(imageUrl)}" style="height: 30px;" />
                <span>Custom Footer - Page <span class="pageNumber"></span> of <span class="totalPages">
                </span></span>
            </div>
        `,
        margin: {
            top: '80px', // Adjust to fit the header
            bottom: '80px', // Adjust to fit the footer
            left: '20px',
            right: '20px'
        }
    });

    await browser.close();


        res.json('ok');

    } catch (e) {
        console.log(e);
    }
});

router.post("/", async (req, res) => {
    try {
        const { headerContent, bodyContent, footerContent } = req.body; // Get HTML content from the request body
        const htmlContent = `
        <html>
            <body>
                <div>${headerContent}</div>
                <div>${bodyContent}</div>
            </body>
        </html>
            `;
        if (!bodyContent) {
            return res.status(400).json({ error: "HTML content is required" });
        }

        console.log("Generating PDF...");
// Replace images with base64 before generating the PDF
        const headerWithBase64 = await replaceImagesWithBase64(headerContent);
        const footerWithBase64 = await replaceImagesWithBase64(footerContent);
        // Launch Puppeteer browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the HTML content provided in the request
        await page.setContent(htmlContent);

        // Generate PDF with header and footer
        const pdfBuffer = await page.pdf({
            path: path.resolve("./output.pdf"), // Path to save the PDF file
            format: 'A4',
            displayHeaderFooter: true, // Enable header and footer
            headerTemplate: headerWithBase64,
            footerTemplate: footerWithBase64,
            margin: {
                top: '200px', // Adjust to fit the header
                bottom: '150px', // Adjust to fit the footer
                left: '20px',
                right: '20px'
            }
        });

        await browser.close();
        
        // Send the generated PDF as a base64 string or as a buffer
        const base64Pdf =  await Buffer.from(pdfBuffer).toString('base64');
        // console.log(base64Pdf)
        // res.setHeader("Content-Type", "application/pdf");
        res.json({ message: "PDF generated successfully!", pdf: base64Pdf });
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
});

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

module.exports = router;

imageUrl = 'https://media.istockphoto.com/id/1967543722/photo/the-city-of-london-skyline-at-night-united-kingdom.jpg?s=2048x2048&w=is&k=20&c=ZMquw-lP_vrSVoUlSWjuWIZHdVma7z4ju9pD1EkRPvs='