const addonService = require("../services/addonManage.service");

const createAddon = async (req, res) => {
    try {
        const addon = await addonService.createAddon(req.user.id, req.body);
        res.status(201).json(addon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAddon = async (req, res) => {
    try {
        const addon = await addonService.updateAddon(req.params.id, req.body);
        res.status(200).json(addon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAddonById = async (req, res) => {
    try {
        const addon = await addonService.getAddonById(req.params.id);
        res.status(200).json(addon);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getAllAddons = async (req, res) => {
    try {
        const addons = await addonService.getAllAddons(req.user.id);
        res.status(200).json(addons);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAddon = async (req, res) => {
    try {
        await addonService.deleteAddon(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createAddon, updateAddon, getAddonById, getAllAddons, deleteAddon };
