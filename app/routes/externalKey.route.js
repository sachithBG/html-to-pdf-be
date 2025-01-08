const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const externalKeyController = require('../controllers/externalKey.controller');

// CRUD Operations for External Keys
router.post('/', authenticateToken, externalKeyController.createExternalKey);  // Create External Key
router.get('/', authenticateToken, externalKeyController.getAllExternalKeys);  // Get All External Keys
router.get('/:id', authenticateToken, externalKeyController.getExternalKeyById); // Get External Key by ID
router.get('/by-addon/:addon_id', authenticateToken, externalKeyController.getExternalKeyByAddonId); // Get External Key by Addon ID
router.put('/:id', authenticateToken, externalKeyController.updateExternalKey); // Update External Key
router.delete('/:id', authenticateToken, externalKeyController.deleteExternalKey); // Delete External Key

module.exports = router;
