const db = require('../config/db');

// Create a new profile
const createProfile = async (userId, theme, avatar) => {
    const result = await db.query(
        "INSERT INTO profiles (user_id, theme, avatar) VALUES (?, ?, ?)",
        [userId, theme, avatar]
    );
    return result.insertId;
};

// Find a profile by user ID
const findProfileByUserId = async (userId) => {
    const [profiles] = await db.query("SELECT * FROM profiles WHERE user_id = ?", [userId]);
    return profiles[0];
};

// Update profile details
const updateProfile = async (userId, theme, avatar) => {
    const result = await db.query(
        "UPDATE profiles SET theme = ?, avatar = ? WHERE user_id = ?",
        [theme, avatar, userId]
    );
    return result.affectedRows;
};

// Delete profile
const deleteProfile = async (userId) => {
    const result = await db.query("DELETE FROM profiles WHERE user_id = ?", [userId]);
    return result.affectedRows;
};

module.exports = { createProfile, findProfileByUserId, updateProfile, deleteProfile };
