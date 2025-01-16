const addonRepository = require("../repositories/addonManage.repository");

const createAddon = async (userId, addonData) => {
    return await addonRepository.createAddon(userId, addonData);
};

const updateAddon = async (id, addonData) => {
    return await addonRepository.updateAddon(id, addonData);
};

const getAddonById = async (id) => {
    return await addonRepository.getAddonById(id);
};

const getAllAddons = async (userId) => {
    return await addonRepository.getAllAddons(userId);
};

const getAllAddonsByOrg = async (orgId) => {
    return await addonRepository.getAllAddonsByOrg(orgId);
};

const deleteAddon = async (id) => {
    return await addonRepository.deleteAddon(id);
};

// Find addon by name
const findAddonByName = async (organization_id, name) => {
    return await addonRepository.findAddonByName(organization_id, name);
};

module.exports = { createAddon, updateAddon, getAddonById, getAllAddons, deleteAddon, getAllAddonsByOrg, findAddonByName };
