const { imageUrl } = require("../utils/htmlConfig.util");

const path = require("path");
const puppeteer = require('puppeteer');
const https = require('https');


// Function to convert HTML content to PDF
const convertHtmlToPdf = async (headerWithBase64, bodyContent, footerWithBase64) => {
  try {
    // Launch Puppeteer browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content provided in the request
    await page.setContent(bodyContent);

    // Generate PDF with header and footer
    const pdfBuffer = await page.pdf({
      path: path.resolve("./output.pdf"), // Path to save the PDF file
      format: "A4",
      displayHeaderFooter: true,
      headerTemplate: headerWithBase64,
      footerTemplate: footerWithBase64,
      margin: {
        top: "200px",
        bottom: "150px",
        left: "20px",
        right: "20px",
      },
    });

    await browser.close();
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

const convertTestPdf = async () => {
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

  await page.setContent(htmlCOntent);
  await page.pdf({
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

module.exports = {
    convertHtmlToPdf,
    replaceImagesWithBase64,
    convertToBase64,
    convertTestPdf,
    generateTableHtml
}
