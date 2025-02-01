// repositories/externalKeyRepository.js
const db = require('../config/db'); // Assuming a MySQL connection instance

const create = async (addonId, key_value) => {
    const query = `INSERT INTO external_keys (addon_id, key_value) VALUES (?, ?)`;
    const [result] = await db.query(query, [addonId, key_value]);
    return { id: result.insertId, addonId, key_value };
};

const getAll = async () => {
    const query = `SELECT * FROM external_keys`;
    const [rows] = await db.query(query);
    return rows;
};

const getById = async (id) => {
    const query = `SELECT * FROM external_keys WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];  // Return the first result (or undefined if not found)
};

const getByKeyValue = async (key_value) => {
    const query = `SELECT * FROM external_keys WHERE key_value = ?`;
    const [rows] = await db.query(query, [key_value]);
    return rows[0];  // Return the first result (or undefined if not found)
};

const getByAddonId = async (addon_id) => {
    const query = `SELECT tag.*, tmpl.id as tmplId FROM external_keys as tag LEFT JOIN pdf_templates as
     tmpl ON tmpl.external_key_id=tag.id WHERE tag.addon_id = ?`;
    const [rows] = await db.query(query, [addon_id]);
    return rows;
};

const update = async (id, addonId, key) => {
    const query = `UPDATE external_keys SET addon_id = ?, key_value = ? WHERE id = ?`;
    const [result] = await db.query(query, [addonId, key, id]);
    return result.affectedRows > 0 ? { id, addonId, key } : null;
};

const delete_ = async (id) => {
    const query = `DELETE FROM external_keys WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
};

const existsByKeyAndAddon = async (addonId, key) => {
    const query = `SELECT COUNT(*) as count FROM external_keys WHERE addon_id = ? AND key_value = ?`;
    const [rows] = await db.query(query, [addonId, key]);
    return rows[0].count > 0; // Returns true if count > 0, otherwise false
};

module.exports = {
    create,
    getAll,
    getById,
    getByKeyValue,
    update,
    delete_,
    existsByKeyAndAddon,
    getByAddonId
};
