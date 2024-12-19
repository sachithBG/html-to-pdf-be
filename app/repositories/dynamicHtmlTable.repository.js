// htmlTableRepository.js

const db = require('../config/db'); // Assuming your DB instance is in 'db.js'

const createHtmlTable = async (tableData) => {
    const { name, organization_id, custom_html, table_rows, cell_styles, num_columns, addon_ids } = tableData;

    const [result] = await db.query(
        "INSERT INTO html_tables (name, organization_id, custom_html, table_rows, cell_styles, num_columns, addon_ids) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [name, organization_id, custom_html, JSON.stringify(table_rows), JSON.stringify(cell_styles), num_columns, JSON.stringify(addon_ids)]
    );

    return { id: result.insertId, ...tableData };
};

const updateHtmlTable = async (id, tableData) => {
    const { name, organization_id, custom_html, table_rows, cell_styles, num_columns, addon_ids } = tableData;

    await db.query(
        "UPDATE html_tables SET name = ?, organization_id = ?, custom_html = ?, table_rows = ?, cell_styles = ?, num_columns = ?, addon_ids = ? WHERE id = ?",
        [name, organization_id, custom_html, JSON.stringify(table_rows), JSON.stringify(cell_styles), num_columns, JSON.stringify(addon_ids), id]
    );

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

const deleteHtmlTable = async (id) => {
    await db.query("DELETE FROM html_tables WHERE id = ?", [id]);
};

module.exports = {
    createHtmlTable,
    updateHtmlTable,
    getHtmlTables,
    getHtmlTableById,
    deleteHtmlTable,
};
