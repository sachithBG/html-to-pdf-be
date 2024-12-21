const db = require("../config/db");

const saveTag = async (tagData) => {
    const { name, organization_id, field_path, tag_type, addon_ids } = tagData;

    // Prepare the SQL query to insert the new tag
    const [result] = await db.query(
        "INSERT INTO tags (name, organization_id, field_path, tag_type, addon_ids) VALUES (?, ?, ?, ?, ?)",
        [name, organization_id, field_path, tag_type, JSON.stringify(addon_ids)]  // JSON.stringify for addon_ids
    );

    // Return the tag data with the inserted ID
    return { id: result.insertId, name, organization_id, field_path, tag_type, addon_ids };
};


const updateTag = async (id, tagData) => {
    const { name, organization_id, field_path, tag_type, addon_ids } = tagData;

    // Prepare the SQL query to update the tag
    await db.query(
        "UPDATE tags SET name = ?, organization_id = ?, field_path = ?, tag_type = ?, addon_ids = ? WHERE id = ?",
        [name, organization_id, field_path, tag_type, JSON.stringify(addon_ids), id]  // JSON.stringify for addon_ids
    );

    // Return the updated tag data
    return { id, name, organization_id, field_path, tag_type, addon_ids };
};


const findTagById = async (id) => {
    const [rows] = await db.query("SELECT * FROM tags WHERE id = ?", [id]);
    return rows[0];
};

const existByKey = async (key) => {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM tags WHERE `field_path` = ?", [key]);
    return rows[0].count > 0;
};

const existByKeyAndId = async (id, key) => {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM tags WHERE id != ? AND `field_path` = ?", [id, key]);
    return rows[0].count > 0;
};

const findTags = async (addon_ids) => {
    const [rows] = await db.query(`
    SELECT * 
    FROM tags 
    WHERE JSON_CONTAINS(addon_ids, ?, '$')
  `, [addon_ids]);
    return rows;
};

const deleteTag = async (id) => {
    await db.query("DELETE FROM tags WHERE id = ?", [id]);
};

module.exports = {
    saveTag,
    updateTag,
    findTagById,
    existByKey,
    existByKeyAndId,
    findTags,
    deleteTag,
};
