// controllers/externalKeyController.js
const externalKeyService = require('../services/externalKey.service');

const createExternalKey = async (req, res) => {
    try {
        const { addon_id, key_value } = req.body;
        const newKey = await externalKeyService.createExternalKey(addon_id, key_value);
        res.status(201).json(newKey);
    } catch (error) {
        console.error("Error creating external key:", error);
        res.status(500).json({ message: 'Failed to create external key' });
    }
};

const getAllExternalKeys = async (req, res) => {
    try {
        const externalKeys = await externalKeyService.getAllExternalKeys();
        res.status(200).json(externalKeys);
    } catch (error) {
        console.error("Error fetching external keys:", error);
        res.status(500).json({ message: 'Failed to fetch external keys' });
    }
};

const getExternalKeyById = async (req, res) => {
    try {
        const { id } = req.params;
        const externalKey = await externalKeyService.getExternalKeyById(id);
        if (!externalKey) {
            return res.status(404).json({ message: 'External Key not found' });
        }
        res.status(200).json(externalKey);
    } catch (error) {
        console.error("Error fetching external key:", error);
        res.status(500).json({ message: 'Failed to fetch external key' });
    }
};

const getExternalKeyByAddonId = async (req, res) => {
    try {
        const { addon_id } = req.params;
        const externalKey = await externalKeyService.getExternalKeyByAddonId(Number(addon_id));
        if (!externalKey) {
            return res.status(404).json({ message: 'External Key not found' });
        }
        res.status(200).json(externalKey);
    } catch (error) {
        console.error("Error fetching external key:", error);
        res.status(500).json({ message: 'Failed to fetch external key' });
    }
};

const updateExternalKey = async (req, res) => {
    try {
        const { id } = req.params;
        const { addon_id, key_value } = req.body;
        const updatedKey = await externalKeyService.updateExternalKey(id, addon_id, key_value);
        if (!updatedKey) {
            return res.status(404).json({ message: 'External Key not found' });
        }
        res.status(200).json(updatedKey);
    } catch (error) {
        console.error("Error updating external key:", error);
        res.status(500).json({ message: 'Failed to update external key' });
    }
};

const deleteExternalKey = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await externalKeyService.deleteExternalKey(id);
        if (!result) {
            return res.status(404).json({ message: 'External Key not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting external key:", error);
        res.status(500).json({ message: 'Failed to delete external key' });
    }
};

module.exports = {
    createExternalKey,
    getAllExternalKeys,
    getExternalKeyById,
    updateExternalKey,
    deleteExternalKey,
    getExternalKeyByAddonId
};
