const db = require('../config/db');  // Database connection

// Create an organization
const createOrganization = async (userId, name, is_default, logo) => {
    const query = 'INSERT INTO organizations (user_id, name, is_default, logo) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [userId, name, is_default, logo]);
    return {
        id: result.insertId,
        user_id: userId,
        name: name,
        is_default: is_default,
        logo: logo,
        created_at: new Date(),
        updated_at: new Date()
    };
};

// Get organizations by user ID
const getOrganizationsByUserId = async (userId) => {
    const query = 'SELECT * FROM organizations WHERE user_id = ?';
    const [organizations] = await db.query(query, [userId]);
    return organizations;
};

// Get organization by ID
const getOrganizationById = async (id) => {
    const query = 'SELECT * FROM organizations WHERE id = ?';
    const [organization] = await db.query(query, [id]);
    return organization[0];
};

// Get organization by user ID and name
const getOrganizationByUserAndName = async (userId, name) => {
    const query = 'SELECT * FROM organizations WHERE user_id = ? AND name = ?';
    const [organization] = await db.query(query, [userId, name]);
    return organization[0];
};

// Update organization
const updateOrganization = async (id, name, is_default, logo) => {
    const query = 'UPDATE organizations SET name = ?, is_default = ?, logo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await db.query(query, [name, is_default, logo, id]);
};

// Update organization to default
const updateOrganizationToDefault = async (id) => {
    const query = 'UPDATE organizations SET is_default = 0 WHERE id != ?';
    await db.query(query, [id]);
    const query2 = 'UPDATE organizations SET is_default = 1 WHERE id = ?';
    await db.query(query2, [id]);
};

// Delete organization
const deleteOrganization = async (id) => {
    const query = 'DELETE FROM organizations WHERE id = ?';
    await db.query(query, [id]);
};

module.exports = {
    createOrganization,
    getOrganizationsByUserId,
    getOrganizationById,
    getOrganizationByUserAndName,
    updateOrganization,
    updateOrganizationToDefault,
    deleteOrganization
};
