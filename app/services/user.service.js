const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

// Register user
const registerUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userRepository.createUser(username, email, hashedPassword);
    return userId;
};

// Login user
const loginUser = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: "3h" });
    return token;
};

// Get user by ID
const getUserById = async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) throw new Error('User not found');
    return user;
};

// Update user
const updateUser = async (id, username, email, password) => {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const result = await userRepository.updateUser(id, username, email, hashedPassword);
    if (result === 0) throw new Error('User not found or not updated');
    return true;
};

// Delete user
const deleteUser = async (id) => {
    const result = await userRepository.deleteUser(id);
    if (result === 0) throw new Error('User not found or not deleted');
    return true;
};

module.exports = { registerUser, loginUser, getUserById, updateUser, deleteUser };
