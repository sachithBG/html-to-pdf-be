const { imageUrl } = require("../utils/htmlConfig.util");

const path = require("path");
const puppeteer = require('puppeteer');
const https = require('https');

const pdfRepository = require('../repositories/pdfManage.repository');

// Service method to save PDF
const savePdf = async (name, headerContent, bodyContent, footerContent, json, margin,
    displayHeaderFooter = true, defVal = "-", organization_id, addon_ids) => {
    try {
        // Check if PDF with the same name already exists
        const existingPdf = await pdfRepository.existsByName(name);
        if (existingPdf) {
            throw new Error('A PDF with this name already exists.');
        }

        // Call repository method to save PDF
        const pdfId = await pdfRepository.savePdf(name, headerContent, bodyContent, footerContent,
            json, margin, displayHeaderFooter, defVal, organization_id, addon_ids);

        return { 
            id: pdfId, 
            name, 
            headerContent, 
            bodyContent, 
            footerContent, 
            json, 
            margin,
            displayHeaderFooter,
            defVal
        };
    } catch (error) {
        console.error('Error saving PDF:', error);
        throw new Error(error);
    }
};

// Service method to update PDF
const updatePdf = async (id, name, headerContent, bodyContent, footerContent, json, margin,
    displayHeaderFooter = true, defVal = "-", organization_id, addon_ids) => {
    try {
        // Check if PDF with the same name already exists, but not the current one being updated
        const existingPdf = await pdfRepository.existsByNameIdNot(name, id);
        if (existingPdf) {
            throw new Error('A PDF with this name already exists.');
        }

        // Call repository method to update PDF
        const updated = await pdfRepository.updatePdf(id, name, headerContent, bodyContent, footerContent, json,
            margin, displayHeaderFooter, defVal, organization_id, addon_ids);
        if (!updated) {
            throw new Error('PDF not found or failed to update.');
        }
        
        return { 
            id, 
            name, 
            headerContent, 
            bodyContent, 
            footerContent, 
            json, 
            margin,
            displayHeaderFooter,
            defVal
        };
    } catch (error) {
        console.error('Error updating PDF:', error);
        throw new Error(error);//'An error occurred while updating the PDF.'
    }
};

// Service method to get PDF by ID
const getPdfById = async (id) => {
    try {
        // Call repository method to get PDF by ID
        const pdf = await pdfRepository.getPdfById(id);
        if (!pdf) {
            throw new Error('PDF not found.');
        }
        return pdf;
    } catch (error) {
        console.error('Error retrieving PDF:', error);
        throw new Error(error);//'An error occurred while retrieving the PDF.'
    }
};

// Service method to check for a PDF by name
const getPdfByName = async (name) => {
    try {
        return await pdfRepository.getPdfByName(name);
    } catch (error) {
        throw new Error(error);//'An error occurred while checking the PDF name.'
    }
};

// Service method to get paginated data
const getDataAsPage = async (sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id) => {
    try {
        // Call repository method to get paginated data
        const data = await pdfRepository.getDataAsPage(sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id);
        return data;
    } catch (error) {
        console.error('Error fetching paginated data:', error);
        throw new Error(error);//'An error occurred while fetching paginated data.'
    }
};

// Service method to delete PDF
const deletePdf = async (id) => {
    try {
        // Call repository method to delete PDF
        const deleted = await pdfRepository.deletePdf(id);
        if (!deleted) {
            throw new Error('PDF not found or failed to delete.');
        }
        return { message: `PDF with ID ${id} deleted successfully.` };
    } catch (error) {
        console.error('Error deleting PDF:', error);
        throw new Error(error);//'An error occurred while deleting the PDF.'
    }
};

// Function to convert HTML content to PDF
const convertHtmlToPdf = async (headerWithBase64, bodyContent, footerWithBase64, margin, 
  displayHeaderFooter
) => {
  try {
    // Launch Puppeteer browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content provided in the request
    await page.setContent(bodyContent);
    console.log(process.env.PDF_PATH)
    // Generate PDF with header and footer
    const pdfBuffer = await page.pdf({
      
      path: path.resolve(process.env.PDF_PATH || "./output.pdf"), // Path to save the PDF file
      format: "A4",
      displayHeaderFooter: displayHeaderFooter,
      headerTemplate: headerWithBase64,
      footerTemplate: footerWithBase64,
      margin: {
        top: margin.top || "200px",
        bottom: margin.bottom || "150px",
        left: margin.left || "20px",
        right: margin.right || "20px",
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
  savePdf,
    updatePdf,
  getPdfById,
    getPdfByName,
    getDataAsPage,
    deletePdf,
    convertHtmlToPdf,
    replaceImagesWithBase64,
    convertToBase64,
    convertTestPdf,
    generateTableHtml
}
