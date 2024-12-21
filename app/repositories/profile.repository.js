const db = require('../config/db');

// Create a new profile
const createProfile = async (userId, theme, avatar) => {
    const result = await db.query(
        "INSERT INTO profiles (user_id, theme, avatar) VALUES (?, ?, ?)",
        [userId, theme, avatar]
    );
    return result ? result[0]?.insertId : null;
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

// Update profile theme
const updateProfileTheme = async (userId, theme) => {
    const result = await db.query("UPDATE profiles SET theme = ? WHERE user_id = ?", [theme, userId]);
    return result.affectedRows;
}

// Update profile avatar
const updateProfileAvatar = async (userId, avatar) => {
    const result = await db.query("UPDATE profiles SET avatar = ? WHERE user_id = ?", [avatar, userId]);
    return result.affectedRows;
}

// Delete profile
const deleteProfile = async (userId) => {
    const result = await db.query("DELETE FROM profiles WHERE user_id = ?", [userId]);
    return result.affectedRows;
};

module.exports = { createProfile, findProfileByUserId, updateProfile, deleteProfile, updateProfileTheme, updateProfileAvatar };
