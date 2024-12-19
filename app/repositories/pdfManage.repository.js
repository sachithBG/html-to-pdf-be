const db = require('../config/db'); // Import the centralized DB connection

// Repository method to save PDF data
const savePdf = async (name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter = true,
    defVal = "-", organization_id, addon_ids) => {
    // Insert PDF data into pdf_templates table
    const sql = 'INSERT INTO pdf_templates (name, organization_id, header_content, body_content, footer_content, ' +
        'json, margin, displayHeaderFooter, defVal) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [name, organization_id, headerContent, bodyContent, footerContent, JSON.stringify(json),
        JSON.stringify(margin), displayHeaderFooter, defVal];
    
    const [result] = await db.query(sql, params);
    const pdfTemplateId = result.insertId;

    // Insert associated addon IDs into pdf_template_addons
    if (addon_ids && addon_ids.length > 0) {
        const addonInsertSql = 'INSERT INTO pdf_template_addons (pdf_template_id, addon_id) VALUES ?';
        const addonParams = addon_ids.map(addon_id => [pdfTemplateId, addon_id]);
        await db.query(addonInsertSql, [addonParams]);
    }

    return pdfTemplateId;
};

// Repository method to update a PDF
const updatePdf = async (id, name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter = true,
    defVal = "-", organization_id, addon_ids) => {
    // Update PDF template data in pdf_templates table
    const sql = 'UPDATE pdf_templates SET name = ?, organization_id = ?, header_content = ?, body_content = ?, ' +
        'footer_content = ?, json = ?, margin = ?, displayHeaderFooter = ?, defVal = ? WHERE id = ?';
    const params = [name, organization_id, headerContent, bodyContent, footerContent, JSON.stringify(json),
        JSON.stringify(margin), displayHeaderFooter, defVal, id];
    
    const [result] = await db.query(sql, params);
    
    if (result.affectedRows > 0) {
        // Update addon associations in pdf_template_addons
        // First, delete previous addon associations
        const deleteAddonsSql = 'DELETE FROM pdf_template_addons WHERE pdf_template_id = ?';
        await db.query(deleteAddonsSql, [id]);

        // Insert new addon associations if provided
        if (addon_ids && addon_ids.length > 0) {
            const addonInsertSql = 'INSERT INTO pdf_template_addons (pdf_template_id, addon_id) VALUES ?';
            const addonParams = addon_ids.map(addon_id => [id, addon_id]);
            await db.query(addonInsertSql, [addonParams]);
        }
    }

    return result.affectedRows > 0;
};

// Repository method to get a PDF by ID
const getPdfById = async (id) => {
    // SQL to fetch PDF details and associated addon details
    const sql = `
        SELECT 
            pdf_templates.*, 
            addons.id AS addon_id, 
            addons.name AS addon_name
        FROM pdf_templates
        LEFT JOIN pdf_template_addons ON pdf_templates.id = pdf_template_addons.pdf_template_id
        LEFT JOIN addons ON pdf_template_addons.addon_id = addons.id
        WHERE pdf_templates.id = ?;
    `;
    const params = [id];
    const [results] = await db.query(sql, params);

    if (results.length === 0) return null;

    // Convert JSON fields to readable format
    const pdf = results[0];
    pdf.json = JSON.parse(pdf.json);
    // pdf.margin = JSON.parse(pdf.margin);

    // Create the addon array with objects { id, name }
    pdf.addons = results
        .map(row => ({
            id: row.addon_id,
            name: row.addon_name
        }))
        .filter(addon => addon.id !== null); // Filter out any rows with no addon

    return pdf;  // Return the PDF data with associated addons as objects
};


// Repository method to get PDF by name
const getPdfByName = async (name) => {
    const sql = 'SELECT * FROM pdf_templates WHERE name = ?';
    const params = [name];
    const [results] = await db.query(sql, params);
    return results[0]; // Returns the first record or null if not found
};

// Repository method to check if PDF exists by name (returns boolean)
const existsByName = async (name) => {
    const sql = `
        SELECT 
            CASE 
                WHEN COUNT(id) > 0 THEN 1
                ELSE 0
            END AS res
        FROM pdf_templates 
        WHERE name = ?;
    `;
    const params = [name];
    
    try {
        const [results] = await db.query(sql, params);
        return results[0].res === 1;
    } catch (error) {
        console.error('Error in existsByName query:', error);
        throw new Error('An error occurred while checking if PDF exists by name.');
    }
};

// Repository method to check if a PDF with the same name exists, but not the one being updated
const existsByNameIdNot = async (name, id) => {
    const sql = `
        SELECT 
            CASE 
                WHEN COUNT(*) > 0 THEN 1
                ELSE 0
            END AS has
        FROM pdf_templates 
        WHERE name = ? AND id != ?;
    `;
    const params = [name, id];

    const [results] = await db.query(sql, params);
    return results[0].has === 1;
};

// Repository method to get paginated data
const getDataAsPage = async (sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id) => {
    const filters = [];
    
    // Base query part
    let sql = 'FROM pdf_templates';
    
    // Add JOIN for pdf_template_addons if filters require it
    if (addonsFilter && addonsFilter.length > 0) {
        sql += ' JOIN pdf_template_addons ON pdf_templates.id = pdf_template_addons.pdf_template_id';
    }

    // WHERE condition
    sql += ' WHERE 1=1';

    // Search filter (if provided)
    if (search) {
        sql += ' AND pdf_templates.name LIKE ?';
        filters.push(`%${search}%`);
    }

    // Organization filter (if provided)
    if (organization_id) {
        sql += ' AND pdf_templates.organization_id = ?';
        filters.push(organization_id);
    }

    // Addons filter (if provided)
    if (addonsFilter && addonsFilter.length > 0) {
        const addonIds = addonsFilter.split(',').map(id => Number(id));
        sql += ' AND pdf_template_addons.addon_id IN (?)';
        filters.push(addonIds);
    }

    // Sorting (if provided)
    if (sortBy) {
        sql += ` ORDER BY ${sortBy} ${sortOrder}`;
    }

    // Pagination
    const limitSql = ` LIMIT ?, ?`;
    filters.push(Number(startFrom), Number(to));

    // Query for the actual paginated data
    const [results] = await db.query(`SELECT DISTINCT pdf_templates.* ${sql} ${limitSql}`, filters);

    // Query to get the total number of distinct records (using COUNT)
    const [countResult] = await db.query(`SELECT COUNT(DISTINCT pdf_templates.id) ${sql}`, filters);

    // Convert JSON fields to readable format
    const data = results.map((pdf) => {
        pdf.json = JSON.parse(pdf.json);
        // pdf.margin = JSON.parse(pdf.margin); // Uncomment if you need margin processing
        return pdf;
    });

    // Return both the paginated data and the total count
    return {
        data,
        total: countResult[0]['COUNT(DISTINCT pdf_templates.id)'] // Extract total count from the query result
    };
};


// Repository method to delete PDF by ID
const deletePdf = async (id) => {
    // Delete addon associations first
    const deleteAddonsSql = 'DELETE FROM pdf_template_addons WHERE pdf_template_id = ?';
    await db.query(deleteAddonsSql, [id]);

    // Now delete the PDF template
    const sql = 'DELETE FROM pdf_templates WHERE id = ?';
    const params = [id];
    const [result] = await db.query(sql, params);
    return result.affectedRows > 0; // Return true if deletion was successful
};

module.exports = {
    savePdf,
    updatePdf,
    getPdfById,
    getPdfByName,
    existsByName,
    existsByNameIdNot,
    getDataAsPage,
    deletePdf,
};
