const express = require('express');
const profileController = require('../controllers/profile.controller');
const authenticateToken = require("../middleware/auth");
const { body } = require('express-validator');

const profileValidation = [
    body('theme').isIn(['light', 'dark']).withMessage('Theme must be "light" or "dark"').optional(),
    body('avatar').isURL().withMessage('Avatar must be a valid URL').optional()
];

const router = express.Router();

// Route for creating a profile
router.post('/', authenticateToken, profileValidation, profileController.createProfile);

// Route for retrieving a user's profile
router.get('/:userId', authenticateToken, profileController.getProfile);

// Route for updating a profile
router.put('/:userId', authenticateToken, profileController.updateProfile);

// Route for updating a user's name
router.put('/:userId/name', authenticateToken, profileController.updateUserName);

// Route for updating a user's theme
router.put('/:userId/theme', authenticateToken, profileController.updateProfileTheme);

// Route for updating a user's avatar
router.put('/:userId/avatar', authenticateToken, profileController.updateProfileAvatar);

// Route for deleting a profile
router.delete('/:userId', authenticateToken, profileController.deleteProfile);

module.exports = router;

