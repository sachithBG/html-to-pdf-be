const express = require('express');
const userController = require('../controllers/user.controller');
const { body } = require('express-validator');
const authenticateToken = require("../middleware/auth");

const registerValidation = [
    body('username').isLength({ min: 3, max: 255 }).withMessage('Username must be between 3 and 255 characters'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const router = express.Router();

// Route for user registration
router.post('/register', registerValidation, userController.register);

// Route for user login
router.post('/login', loginValidation, userController.login);

// Route to get user by ID
router.get('/:id', authenticateToken, userController.getUser);

// Route to update user
router.put('/:id', authenticateToken, userController.updateUser);

// Route to delete user
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
