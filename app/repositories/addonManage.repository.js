const db = require("../config/db");

const createAddon = async (userId, { name }) => {
    const [result] = await db.query(
        "INSERT INTO addons (organization_id, name) VALUES ((SELECT id FROM organizations WHERE user_id = ? LIMIT 1), ?)",
        [userId, name]
    );
    return { id: result.insertId, name };
};

const updateAddon = async (id, { name }) => {
    await db.query("UPDATE addons SET name = ? WHERE id = ?", [name, id]);
    return { id, name };
};

const getAddonById = async (id) => {
    const [addons] = await db.query("SELECT * FROM addons WHERE id = ?", [id]);
    if (addons.length === 0) throw new Error("Addon not found");
    return addons[0];
};

const getAllAddons = async (userId) => {
    const [addons] = await db.query(
        "SELECT addons.* FROM addons JOIN organizations ON addons.organization_id = organizations.id WHERE organizations.is_default=true AND organizations.user_id = ?",
        [userId]
    );
    return addons;
};

const getAllAddonsByOrg = async (orgId) => {
    const [addons] = await db.query(
        "SELECT addons.* FROM addons JOIN organizations ON addons.organization_id = organizations.id WHERE organizations.id = ?",
        [orgId]
    );
    return addons;
};

const deleteAddon = async (id) => {
    await db.query("DELETE FROM addons WHERE id = ?", [id]);
};

module.exports = { createAddon, updateAddon, getAddonById, getAllAddons, deleteAddon, getAllAddonsByOrg };
