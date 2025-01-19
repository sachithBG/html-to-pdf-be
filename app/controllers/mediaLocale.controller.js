const MediaService = require('../services/mediaLocale.service');

const mediaService = new MediaService();

const createMedia = async (req, res) => {
    try {
        const mediaId = await mediaService.createMedia(req.body);
        res.status(201).json({ id: mediaId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMediaById = async (req, res) => {
    try {
        const media = await mediaService.getMediaById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllMediaByOrganization = async (req, res) => {
    try {
        const { addon_ids } = req.query;
        const media = await mediaService.getAllMediaByOrganization(req.params.orgId, addon_ids || []);
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMedia = async (req, res) => {
    try {
        await mediaService.updateMedia(req.params.id, req.body);
        res.status(200).json({ message: 'Media updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMedia = async (req, res) => {
    try {
        await mediaService.deleteMedia(req.params.id);
        res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMedia,
    getMediaById,
    getAllMediaByOrganization,
    updateMedia,
    deleteMedia,
};
