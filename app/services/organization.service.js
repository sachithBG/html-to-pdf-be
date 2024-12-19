const organizationRepository = require('../repositories/organization.ropository');

// Create organization
const createOrganization = async (userId, name) => {
    // Check if organization with this name already exists for the user
    const existingOrganization = await organizationRepository.getOrganizationByUserAndName(userId, name);
    if (existingOrganization) {
        throw new Error('Organization with this name already exists.');
    }
    return await organizationRepository.createOrganization(userId, name);
};

// Get organizations by user ID
const getOrganizationsByUserId = async (userId) => {
    return await organizationRepository.getOrganizationsByUserId(userId);
};

// Get organization by ID
const getOrganizationById = async (id) => {
    return await organizationRepository.getOrganizationById(id);
};

// Update organization
const updateOrganization = async (id, name) => {
    const existingOrganization = await organizationRepository.getOrganizationById(id);
    if (!existingOrganization) {
        throw new Error('Organization not found.');
    }
    return await organizationRepository.updateOrganization(id, name);
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
    deleteOrganization
};
