const { validationResult } = require('express-validator');
const profileService = require('../services/profile.service');
const userService = require('../services/user.service');

// Create profile
const createProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, theme, avatar } = req.body;

    try {
        const profileId = await profileService.createProfile(userId, theme, avatar);
        res.status(201).json({ profileId, theme, avatar });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get profile by user ID
const getProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const profile = await profileService.getProfile(userId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { theme, avatar } = req.body;

    try {
        await profileService.updateProfile(userId, theme, avatar);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update user name
const updateUserName = async (req, res) => {
    const { userId } = req.params;
    const { name } = req.body;

    try {
        await userService.updateUserName(userId, name);
        res.status(200).json({ message: 'User name updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update profile theme
const updateProfileTheme = async (req, res) => {
    const { userId } = req.params;
    const { theme } = req.body;

    try {
        await profileService.updateProfileTheme(userId, theme);
        res.status(200).json({ message: 'Profile theme updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update profile avatar
const updateProfileAvatar = async (req, res) => {
    const { userId } = req.params;
    const { avatar } = req.body;

    try {
        await profileService.updateProfileAvatar(userId, avatar);
        res.status(200).json({ message: 'Profile avatar updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete profile
const deleteProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        await profileService.deleteProfile(userId);
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createProfile, getProfile, updateProfile, deleteProfile, updateProfileTheme, updateProfileAvatar, updateUserName };
