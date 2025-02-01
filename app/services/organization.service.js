const organizationRepository = require('../repositories/organization.ropository');

// Create organization
const createOrganization = async (userId, name, is_default, logo) => {
    // Check if organization with this name already exists for the user
    const existingOrganization = await organizationRepository.getOrganizationByUserAndName(userId, name);
    if (existingOrganization) {
        throw new Error('Organization with this name already exists.');
    }
    return await organizationRepository.createOrganization(userId, name, is_default || 0, logo);
};

// Get organizations by user ID
const getOrganizationsByUserId = async (userId) => {
    let res = await organizationRepository.getOrganizationsByUserId(userId);
    if (!res || res.length === 0) {
        res = [await createOrganization(userId, 'Default', 1)];
    }
    return res;
};

// Get organization by ID
const getOrganizationById = async (id) => {
    return await organizationRepository.getOrganizationById(id);
};

// Update organization
const updateOrganization = async (id, name, is_default, logo) => {
    const existingOrganization = await organizationRepository.getOrganizationById(id);
    if (!existingOrganization) {
        throw new Error('Organization not found.');
    }
    return await organizationRepository.updateOrganization(id, name, is_default, logo);
};

const updateOrganizationV2 = async (id, name, logo) => {
    const existingOrganization = await organizationRepository.getOrganizationById(id);
    if (!existingOrganization) {
        throw new Error('Organization not found.');
    }
    return await organizationRepository.updateOrganizationV2(id, name, logo);
};

// Update organization to default
const updateOrganizationToDefault = async (id) => {
    const existingOrganization = await organizationRepository.getOrganizationById(id);
    if (!existingOrganization) {
        throw new Error('Organization not found.');
    }
    return await organizationRepository.updateOrganizationToDefault(id);
};

// Delete organization
const deleteOrganization = async (id) => {
    const existingOrganization = await organizationRepository.getOrganizationById(id);
    if (!existingOrganization) {
        throw new Error('Organization not found.');
    }
    return await organizationRepository.deleteOrganization(id);
};

// const getOrganizationById = async (organizationId) => {
//     return await organizationRepository.findById(organizationId);
// };

module.exports = {
    getOrganizationById
};


module.exports = {
    createOrganization,
    getOrganizationsByUserId,
    getOrganizationById,
    updateOrganization,
    updateOrganizationToDefault,
    deleteOrganization,
    updateOrganizationV2
};
