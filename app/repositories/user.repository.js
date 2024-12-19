const db = require('../config/db');

// Create a new user
const createUser = async (username, email, hashedPassword) => {
    const result = await db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
    );
    return result.insertId;
};

// Find a user by email
const findUserByEmail = async (email) => {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return users[0];
};

// Find a user by ID
const findUserById = async (id) => {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return users[0];
};

// Update user details
const updateUser = async (id, username, email, password) => {
    const result = await db.query(
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
        [username, email, password, id]
    );
    return result.affectedRows;
};

// Delete user
const deleteUser = async (id) => {
    const result = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
};

module.exports = { createUser, findUserByEmail, findUserById, updateUser, deleteUser };
