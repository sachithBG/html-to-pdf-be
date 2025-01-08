// services/externalKeyService.js
const externalKeyRepository = require('../repositories/externalKey.repository');

const createExternalKey = async (addonId, key) => {
    const exists = await externalKeyRepository.existsByKeyAndAddon(addonId, key);
    if (exists) {
        throw new Error('This key already exists for the specified addon.');
    }
    return await externalKeyRepository.create(addonId, key);
};

const getAllExternalKeys = async () => {
    return await externalKeyRepository.getAll();
};

const getExternalKeyById = async (id) => {
    return await externalKeyRepository.getById(id);
};

const getExternalKeyByAddonId = async (id) => {
    return await externalKeyRepository.getByAddonId(id);
};

const updateExternalKey = async (id, addonId, key) => {
    return await externalKeyRepository.update(id, addonId, key);
};

const deleteExternalKey = async (id) => {
    return await externalKeyRepository.delete_(id);
};

module.exports = {
    createExternalKey,
    getAllExternalKeys,
    getExternalKeyById,
    updateExternalKey,
    deleteExternalKey,
    getExternalKeyByAddonId
};
