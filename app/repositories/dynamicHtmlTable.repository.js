// htmlTableRepository.js

const db = require('../config/db'); // Assuming your DB instance is in 'db.js'

const createHtmlTable = async (tableData) => {
    const { name, organization_id, custom_html, table_rows, cell_styles, num_columns, addon_ids, tag_id, col_keys } = tableData;

    const [result] = await db.query(
        "INSERT INTO html_tables (name, organization_id, custom_html, table_rows, cell_styles, num_columns, addon_ids, tag_id, col_keys)" +
        "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, organization_id, custom_html, JSON.stringify(table_rows), JSON.stringify(cell_styles), num_columns,
            JSON.stringify(addon_ids), tag_id, JSON.stringify(col_keys)]
    );

    // Insert associated addon IDs into pdf_template_addons
    if (addon_ids && addon_ids.length > 0) {
        const addonInsertSql = 'INSERT INTO html_tables_addons (html_table_id, addon_id) VALUES ?';
        const addonParams = addon_ids.map(addon_id => [result.insertId, addon_id]);
        await db.query(addonInsertSql, [addonParams]);
    }

    return { id: result.insertId, ...tableData };
};

const updateHtmlTable = async (id, tableData) => {
    const { name, organization_id, custom_html, table_rows, cell_styles, num_columns, addon_ids, tag_id, col_keys } = tableData;

    const [result] = await db.query(
        "UPDATE html_tables SET name = ?, organization_id = ?, custom_html = ?, table_rows = ?, cell_styles = ?," +
        "num_columns = ?, addon_ids = ?, tag_id = ?, col_keys = ? WHERE id = ? ",
        [name, organization_id, custom_html, JSON.stringify(table_rows), JSON.stringify(cell_styles), num_columns,
            JSON.stringify(addon_ids), tag_id, JSON.stringify(col_keys), id]
    );

    if (result.affectedRows > 0) {
        // Update addon associations in pdf_template_addons
        // First, delete previous addon associations
        const deleteAddonsSql = 'DELETE FROM html_tables_addons WHERE html_table_id = ?';
        await db.query(deleteAddonsSql, [id]);

        // Insert new addon associations if provided
        if (addon_ids && addon_ids.length > 0) {
            const addonInsertSql = 'INSERT INTO html_tables_addons (html_table_id, addon_id) VALUES ?';
            const addonParams = addon_ids.map(addon_id => [id, addon_id]);
            await db.query(addonInsertSql, [addonParams]);
        }
    }

    return { id, ...tableData };
};

const getHtmlTables = async (organization_id) => {
    const [tables] = await db.query("SELECT * FROM html_tables WHERE organization_id = ?", [organization_id]);
    return tables;
};

const getHtmlTableById = async (id) => {
    const [table] = await db.query("SELECT * FROM html_tables WHERE id = ?", [id]);
    return table[0];
};

// Repository method to get paginated data
const getDataAsPage = async (sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id) => {
    // Base SQL query for data
    let sql = `
        SELECT 
            ht.id,
            ht.organization_id,
            ht.name,
            tg.name AS tagName,
            tg.field_path,
            ht.created_at,
            ht.modified_at,
            GROUP_CONCAT(DISTINCT addons.name) AS addons
        FROM 
            html_tables ht
        LEFT JOIN 
            html_tables_addons pta ON ht.id = pta.html_table_id
        LEFT JOIN
            addons ON addons.id = pta.addon_id
        LEFT JOIN
            tags AS tg ON tg.id = ht.tag_id
        WHERE 1=1
    `;

    // Base SQL query for counting total rows
    let countSql = `
        SELECT 
            COUNT(DISTINCT ht.id) AS total
        FROM 
            html_tables ht
        LEFT JOIN 
            html_tables_addons pta ON ht.id = pta.html_table_id
        LEFT JOIN
            tags AS tg ON tg.id = ht.tag_id
        WHERE 1=1
    `;

    const filters = [];
    let havingClause = '';

    // Organization filter
    if (organization_id) {
        sql += ' AND ht.organization_id = ?';
        countSql += ' AND ht.organization_id = ?';
        filters.push(organization_id);
    }

    // Search filter (searching in `name` and `tagName`)
    if (search && search.trim().length > 0) {
        sql += ' AND (ht.name LIKE ? OR tg.field_path LIKE ?)';
        countSql += ' AND (ht.name LIKE ? OR tg.field_path LIKE ?)';
        filters.push(`%${search}%`, `%${search}%`);
    }

    // Addons filter
    if (addonsFilter && addonsFilter.length > 0) {
        const addonIds = addonsFilter.map(Number);
        havingClause = `
            HAVING COUNT(DISTINCT CASE 
                WHEN pta.addon_id IN (${addonIds.map(() => '?').join(',')}) 
                THEN pta.addon_id 
            END) = ?
        `;
        filters.push(...addonIds, addonIds.length);
    }

    // GROUP BY clause for all non-aggregated columns
    sql += `
        GROUP BY 
            ht.id, 
            ht.organization_id, 
            ht.name, 
            tg.name, 
            ht.created_at, 
            ht.modified_at
    `;

    // Apply the HAVING clause (if applicable)
    if (havingClause) {
        sql += havingClause;
    }

    // Sorting
    sql += ` ORDER BY ht.${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`;

    // Pagination
    sql += ' LIMIT ?, ?';
    filters.push(Number(startFrom), Number(to));

    try {
        // Execute data query
        const [data] = await db.query(sql, filters);

        // Execute count query (exclude pagination and HAVING-related params)
        const baseFiltersLength = addonsFilter ? filters.length - addonsFilter.length - 2 : filters.length - 2;
        const [totalResult] = await db.query(countSql, filters.slice(0, baseFiltersLength));
        const total = totalResult[0]?.total || 0;

        // Process `addons` field to convert it from a comma-separated string to an array
        const processedData = data.map(row => ({
            ...row,
            addons: row.addons ? row.addons.split(',').map(addon => addon.trim()) : [],
        }));

        // Return the processed data and total count
        return {
            data: processedData,
            total,
        };
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
};


const deleteHtmlTable = async (id) => {
    await db.query("DELETE FROM html_tables_addons WHERE html_table_id = ?", [id]);
    await db.query("DELETE FROM html_tables WHERE id = ?", [id]);
};

module.exports = {
    createHtmlTable,
    updateHtmlTable,
    getHtmlTables,
    getHtmlTableById,
    getDataAsPage,
    deleteHtmlTable,
};
