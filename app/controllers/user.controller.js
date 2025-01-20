const { validationResult } = require('express-validator');
const userService = require('../services/user.service');

// Register user
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const userId = await userService.registerUser(name, email, password);
        res.status(201).json({ id: userId, name, email });
    } catch (error) {
        // res.status(400).json({ error: error.message });
        console.log(error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Email is already in use.' });
        } else if (error.code === 'INVALID_INPUT') {
            res.status(422).json({ error: 'Invalid input data provided.' });
        } else {
            res.status(400).json({ error: error.message }); // Fallback for generic errors
        }
    }
};

// Login user
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, rememberMe } = req.body;

    try {
        const token = await userService.loginUser(email, password, rememberMe);
        res.status(200).json(token);
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: error.message });
    }
};

// Get user by ID
const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        await userService.updateUser(id, name, email, password);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await userService.deleteUser(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { register, login, getUser, updateUser, deleteUser };
