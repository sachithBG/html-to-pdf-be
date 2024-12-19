const organizationService = require('../services/organization.service');

// Create organization
const createOrganization = async (req, res) => {
    const { userId, name } = req.body;

    try {
        const organization = await organizationService.createOrganization(userId, name);
        res.status(201).json(organization);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all organizations for a specific user
const getOrganizationsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const organizations = await organizationService.getOrganizationsByUserId(userId);
        res.status(200).json(organizations);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Get organization by ID
const getOrganizationById = async (req, res) => {
    const { id } = req.params;

    try {
        const organization = await organizationService.getOrganizationById(id);
        res.status(200).json(organization);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Update organization
const updateOrganization = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        await organizationService.updateOrganization(id, name);
        res.status(200).json({ message: 'Organization updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete organization
const deleteOrganization = async (req, res) => {
    const { id } = req.params;

    try {
        await organizationService.deleteOrganization(id);
        res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createOrganization,
    getOrganizationsByUserId,
    getOrganizationById,
    updateOrganization,
    deleteOrganization
};