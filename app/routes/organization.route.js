const express = require('express');
const organizationController = require('../controllers/organization.controller');
const { body, param } = require('express-validator');
const authenticateToken = require("../middleware/auth");

// Validation for creating organization
const createOrganizationValidation = [
    body('user_id').isInt().withMessage('User ID must be an integer').notEmpty().withMessage('User ID is required'),
    body('name').isString().withMessage('Organization name must be a string').notEmpty().withMessage('Organization name is required')
];

// Validation for updating organization
const updateOrganizationValidation = [
    param('id').isInt().withMessage('Organization ID must be an integer').notEmpty().withMessage('Organization ID is required'),
    body('name').isString().withMessage('Organization name must be a string').notEmpty().withMessage('Organization name is required')
];

const router = express.Router();

// Route for creating an organization
router.post('/', authenticateToken, createOrganizationValidation, organizationController.createOrganization);

// Route for getting all organizations by user ID
router.get('/:userId', authenticateToken, organizationController.getOrganizationsByUserId);

// Route for getting an organization by ID
router.get('/organization/:id', authenticateToken, organizationController.getOrganizationById);

// Route for updating an organization
router.put('/:id', authenticateToken, updateOrganizationValidation, organizationController.updateOrganization);

// Route for updating an organization to default
router.put('/:id/default', authenticateToken, organizationController.updateOrganizationToDefault);

// Route for deleting an organization
router.delete('/:id', authenticateToken, organizationController.deleteOrganization);

module.exports = router;
