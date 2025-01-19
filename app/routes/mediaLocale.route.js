const express = require('express');
const authenticateToken = require('../middleware/auth');
const mediaController = require('../controllers/mediaLocale.controller');

const router = express.Router();

// router.post('/', MediaController.createMedia);
router.get('/:id', authenticateToken, mediaController.getMediaById);
router.get('/organization/:orgId', authenticateToken, mediaController.getAllMediaByOrganization);
// router.put('/:id', MediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
