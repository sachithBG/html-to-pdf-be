const db = require('../config/db');

// Create a new user
const createUser = async (name, email, hashedPassword, role) => {
    const result = await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role]
    );
    return result ? result[0]?.insertId : null;
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
const updateUser = async (id, name, email, password) => {
    const result = await db.query(
        "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
        [name, email, password, id]
    );
    return result.affectedRows;
};

// Update user name
const updateUserName = async (id, name) => {
    const result = await db.query("UPDATE users SET name = ? WHERE id = ?", [name, id]);
    return result.affectedRows;
};

// Delete user
const deleteUser = async (id) => {
    const result = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
};

module.exports = { createUser, findUserByEmail, findUserById, updateUser, deleteUser, updateUserName };
