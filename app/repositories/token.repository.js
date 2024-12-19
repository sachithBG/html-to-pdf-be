const db = require('../config/db'); // DB connection

// Save refresh token for the organization
const saveRefreshToken = async (organizationId, refreshToken) => {
    const sql = 'UPDATE organizations SET refresh_token = ? WHERE id = ?';
    const params = [refreshToken, organizationId];
    await db.query(sql, params);
};

module.exports = {
    saveRefreshToken
};
