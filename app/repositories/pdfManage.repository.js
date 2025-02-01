const db = require('../config/db'); // Import the centralized DB connection

// Repository method to save PDF data
const savePdf = async (name, headerContent, bodyContent, footerContent, json={}, margin, displayHeaderFooter = true,
    defVal = "-", organization_id, addon_ids, external_key, sections, subcategories) => {
    // Insert PDF data into pdf_templates table
    const sql = 'INSERT INTO pdf_templates (name, organization_id, header_content, body_content, footer_content, json, ' +
        'margin, displayHeaderFooter, defVal, external_key_id, sections, subcategories) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [name, organization_id, headerContent, bodyContent, footerContent, JSON.stringify(json, null, 2),
        JSON.stringify(margin), displayHeaderFooter, defVal, external_key, JSON.stringify(sections), JSON.stringify(subcategories)];
    //JSON.stringify(json, null, 2)
    const [result] = await db.query(sql, params);
    const pdfTemplateId = result.insertId;

    // Insert associated addon IDs into pdf_template_addons
    // if (addon_ids && addon_ids.length > 0) {
    //     const addonInsertSql = 'INSERT INTO pdf_template_addons (pdf_template_id, addon_id) VALUES ?';
    //     const addonParams = addon_ids.map(addon_id => [pdfTemplateId, addon_id]);
    //     await db.query(addonInsertSql, [addonParams]);
    // }

    return pdfTemplateId;
};

// Repository method to update a PDF
const updatePdf = async (id, name, headerContent, bodyContent, footerContent, json, margin, displayHeaderFooter = true,
    defVal = "-", organization_id, addon_ids, external_key, sections, subcategories) => {
    // Update PDF template data in pdf_templates table
    const sql = 'UPDATE pdf_templates SET name = ?, organization_id = ?, header_content = ?, body_content = ?, ' +
        'footer_content = ?, margin = ?, displayHeaderFooter = ?, defVal = ?, external_key_id = ? , sections = ?, subcategories = ? WHERE id = ?';
    const params = [name, organization_id, headerContent, bodyContent, footerContent,
        JSON.stringify(margin), displayHeaderFooter, defVal, external_key,
        JSON.stringify(sections), JSON.stringify(subcategories), id];

    const [result] = await db.query(sql, params);

    // if (result.affectedRows > 0) {
    //     // Update addon associations in pdf_template_addons
    //     // First, delete previous addon associations
    //     const deleteAddonsSql = 'DELETE FROM pdf_template_addons WHERE pdf_template_id = ?';
    //     await db.query(deleteAddonsSql, [id]);

    //     // Insert new addon associations if provided
    //     if (addon_ids && addon_ids.length > 0) {
    //         const addonInsertSql = 'INSERT INTO pdf_template_addons (pdf_template_id, addon_id) VALUES ?';
    //         const addonParams = addon_ids.map(addon_id => [id, addon_id]);
    //         await db.query(addonInsertSql, [addonParams]);
    //     }
    // }

    return result.affectedRows > 0;
};

const updateDummyData = async (id, json) => {
    // Update PDF template data in pdf_templates table
    const sql = 'UPDATE pdf_templates SET json = ? WHERE id = ?';
    const params = [JSON.stringify(json), id];
    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
}

// Repository method to get a PDF by ID
const getPdfById = async (id) => {
    // SQL to fetch PDF details and associated addon details
    const sql = `
        SELECT 
            pt.*, 
            a.id AS addon_id,
            a.name AS addon_name
        FROM pdf_templates pt
        LEFT JOIN external_keys ext ON ext.id = pt.external_key_id
        LEFT JOIN addons a ON ext.addon_id = a.id
        WHERE pt.id = ?;
    `;
    const params = [id];
    const [results] = await db.query(sql, params);

    if (results.length === 0) return null;

    // Convert JSON fields to readable format
    const pdf = results[0];
    // pdf.json = JSON.parse(pdf.json);
    // pdf.margin = JSON.parse(pdf.margin);

    // Create the addon array with objects { id, name }
    // pdf.addons = results
    //     .map(row => ({
    //         id: row.addon_id,
    //         name: row.addon_name
    //     }))
    //     .filter(addon => addon.id !== null); // Filter out any rows with no addon

    return pdf;  // Return the PDF data with associated addons as objects
};


// Repository method to get PDF by name
const getPdfByKey = async (organization_id, addon, key) => {
    const sql = `
        SELECT t.* 
        FROM pdf_templates t
        JOIN external_keys k ON t.external_key_id = k.id
        JOIN addons addn ON k.addon_id = addn.id
        WHERE addn.organization_id = ? 
          AND addn.name = ? 
          AND k.key_value = ?;
    `;
    const params = [organization_id, addon, key];
    const [results] = await db.query(sql, params);
    return results?.[0] || null;
};

// Repository method to check if PDF exists by name (returns boolean)
const existsByExternalKey = async (key) => {
    const sql = `
        SELECT 
            CASE 
                WHEN COUNT(id) > 0 THEN 1
                ELSE 0
            END AS res
        FROM pdf_templates 
        WHERE external_key_id = ?;
    `;
    const params = [key];

    try {
        const [results] = await db.query(sql, params);
        return results[0].res === 1;
    } catch (error) {
        console.error('Error in existsByName query:', error);
        throw new Error('An error occurred while checking if PDF exists by name.');
    }
};

// Repository method to check if a PDF with the same name exists, but not the one being updated
const existsByKeyIdNot = async (key, id) => {
    const sql = `
        SELECT 
            CASE 
                WHEN COUNT(*) > 0 THEN 1
                ELSE 0
            END AS has
        FROM pdf_templates 
        WHERE external_key_id = ? AND id != ?;
    `;
    const params = [key, id];

    const [results] = await db.query(sql, params);
    return results[0].has === 1;
};

// Repository method to get paginated data 
// todo ---------------------------------------------------
const getDataAsPage = async (sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id) => {
    let sql = `
        SELECT
            pt.id,
            pt.organization_id,
            pt.name,
            pt.margin,
            pt.displayHeaderFooter,
            pt.defVal,
            pt.created_at,
            pt.modified_at,
            pt.external_key_id,
            ext.key_value AS external_key,
            GROUP_CONCAT(DISTINCT addons.name) AS addons
        FROM
            pdf_templates pt
        LEFT JOIN
            external_keys ext ON pt.external_key_id = ext.id
        LEFT JOIN
            addons ON addons.id = ext.addon_id
    `;
    let countSql = `
        SELECT
            COUNT(DISTINCT pt.id) AS total
        FROM
            pdf_templates pt
        LEFT JOIN
            external_keys ext ON pt.external_key_id = ext.id
        LEFT JOIN
            addons ON addons.id = ext.addon_id
    `;

    const filters = [];
    let havingClause = '';

    sql += ' WHERE 1=1';
    countSql += ' WHERE 1=1';

    // Organization filter
    if (organization_id) {
        sql += ' AND pt.organization_id = ?';
        countSql += ' AND pt.organization_id = ?';
        filters.push(organization_id);
    }

    // Search filter
    if (search && search.trim().length > 0) {
        sql += ' AND pt.name LIKE ?';
        countSql += ' AND pt.name LIKE ?';
        filters.push(`%${search}%`);
    }

    // Addons filter
    if (addonsFilter && addonsFilter?.length > 0) {
        const addonPlaceholders = addonsFilter.map(() => '?').join(',');
        havingClause = ` HAVING COUNT(DISTINCT CASE WHEN addons.id IN (${addonPlaceholders}) THEN addons.id END) = ?`;
        filters.push(...addonsFilter, addonsFilter.length);
    }

    // Add GROUP BY clause with all non-aggregated columns
    sql += `
        GROUP BY
            pt.id,
            pt.organization_id,
            pt.name,
            pt.margin,
            pt.displayHeaderFooter,
            pt.defVal,
            pt.created_at,
            pt.modified_at
    `;

    // Apply the HAVING clause if applicable
    if (havingClause) {
        sql += havingClause;
    }

    // Sort order
    sql += ` ORDER BY pt.${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`;

    // Pagination
    sql += ' LIMIT ?, ?';
    filters.push(Number(startFrom), Number(to));

    try {
        const [data] = await db.query(sql, filters);
        const [totalResult] = await db.query(countSql, filters.slice(0, addonsFilter ? -(addonsFilter.length + 2) : -2)); // Exclude pagination and HAVING params
        const total = totalResult[0]?.total || 0;

        // Convert the `addons` field from a comma-separated string to an array
        const processedData = data.map(row => ({
            ...row,
            addons: row.addons ? row.addons.split(',') : [], // Convert to array of numbers
        }));

        return {
            data: processedData,
            total,
        };
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
};

// Repository Method: Get Template by externalKey and addon.name
//todo ----------------------------------------------------
const getTemplateByExternalKeyAndAddon = async (externalKey, addonName) => {
    const query = `
        SELECT pt.* 
        FROM pdf_templates pt
        JOIN external_keys ext ON pt.external_key_id = ext.id
        JOIN addons a ON ext.addon_id = a.id
        WHERE ext.key_value = ? AND a.name = ?;
    `;
    const [rows] = await db.query(query, [externalKey, addonName]);
    return rows?.[0] || null; // Safely return the first matching row or null
};




const getDataAsPage2 = async (sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id) => {
    const filters = [];

    // Base query part (always join pdf_template_addons and addons)
    let sql = 'FROM pdf_templates';

    // Join pdf_template_addons and addons to get associated addons
    sql += ' LEFT JOIN pdf_template_addons ON pdf_templates.id = pdf_template_addons.pdf_template_id';
    sql += ' LEFT JOIN addons ON pdf_template_addons.addon_id = addons.id';

    // WHERE condition
    sql += ' WHERE 1=1';

    // Search filter (if provided)
    if (search && search !== null) {
        sql += ' AND pdf_templates.name LIKE ?';
        filters.push(`%${search}%`);
    }

    // Organization filter (if provided)
    if (organization_id) {
        sql += ' AND pdf_templates.organization_id = ?';
        filters.push(organization_id);
    }

    // Addons filter (only apply if it's not null or empty)
    if (addonsFilter && addonsFilter.length > 0) {
        const addonIds = addonsFilter.split(',').map(id => Number(id));
        sql += ' AND pdf_template_addons.addon_id IN (?)';
        filters.push(addonIds);
    }

    // Sorting (if provided)
    if (sortBy) {
        if (!sortBy.startsWith('pdf_templates.')) sortBy = `pdf_templates.${sortBy}`;
        sql += ` ORDER BY ${sortBy} ${sortOrder}`;
    }

    // Pagination
    const limitSql = ` LIMIT ?, ?`;
    filters.push(Number(startFrom), Number(to));

    // Query for the actual paginated data
    const [results] = await db.query(`
        SELECT DISTINCT pdf_templates.id, pdf_templates.name, pdf_templates.created_at, pdf_templates.modified_at, addons.name AS addon_name
        ${sql} 
        ${limitSql}`, filters);

    // Query to get the total number of distinct records (using COUNT)
    const [countResult] = await db.query(`SELECT COUNT(DISTINCT pdf_templates.id) ${sql}`, filters);

    // Process results to group addons by template id
    const data = [];
    let currentTemplate = null;

    results.forEach((pdf) => {
        // If this is a new template, create a new object
        if (!currentTemplate || currentTemplate.id !== pdf.id) {
            if (currentTemplate) data.push(currentTemplate);
            currentTemplate = {
                id: pdf.id,
                name: pdf.name,
                created_at: pdf.created_at,
                modified_at: pdf.modified_at,
                addons: []
            };
        }

        // If addon name exists, push it into the addons array
        if (pdf.addon_name) {
            currentTemplate.addons.push(pdf.addon_name);
        }
    });

    // Push the last template into the data array
    if (currentTemplate) {
        data.push(currentTemplate);
    }

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

// Fetch template by ID
const fetchTemplateById = async (id) => {
    try {
        const [rows] = await db.query("SELECT * FROM pdf_templates WHERE id = ?", [id]);
        return rows[0] || null;
    } catch (error) {
        console.error("Error in fetchTemplateById:", error);
        throw new Error("Failed to fetch template by ID.");
    }
};

// Fetch template by Addon ID and type/status
//todo ---------------------------------
const fetchTemplateByAddon = async (addonId, typeStatus) => {
    try {
        const [rows] = await db.query(
            `
            SELECT pt.* 
            FROM pdf_templates AS pt
            INNER JOIN pdf_template_addons AS pta ON pt.id = pta.pdf_template_id
            WHERE pta.addon_id = ? AND pt.external_key_id = ?
            `,
            [addonId, typeStatus]
        );
        return rows[0] || null;
    } catch (error) {
        console.error("Error in fetchTemplateByAddon:", error);
        throw new Error("Failed to fetch template by addon ID and type/status.");
    }
};


module.exports = {
    savePdf,
    updatePdf,
    getPdfById,
    getPdfByKey,
    existsByExternalKey,
    existsByKeyIdNot,
    getDataAsPage,
    deletePdf,
    getTemplateByExternalKeyAndAddon,
    updateDummyData,
    fetchTemplateById,
    fetchTemplateByAddon,
};
