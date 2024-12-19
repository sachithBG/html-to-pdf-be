const db = require('../config/db');  // Database connection

// Create an organization
const createOrganization = async (userId, name) => {
    const query = 'INSERT INTO organizations (user_id, name) VALUES (?, ?)';
    const [result] = await db.query(query, [userId, name]);
    return {
        id: result.insertId,
        user_id: userId,
        name: name,
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
const updateOrganization = async (id, name) => {
    const query = 'UPDATE organizations SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await db.query(query, [name, id]);
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
    deleteOrganization
};
