const profileRepository = require('../repositories/profile.repository');

// Create profile
const createProfile = async (userId, theme, avatar) => {
    const profileId = await profileRepository.createProfile(userId, theme, avatar);
    return profileId;
};

// Get profile by user ID
const getProfile = async (userId) => {
    const profile = await profileRepository.findProfileByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return profile;
};

// Update profile
const updateProfile = async (userId, theme, avatar) => {
    const result = await profileRepository.updateProfile(userId, theme, avatar);
    if (result === 0) throw new Error('Profile not found or not updated');
    return true;
};

// Delete profile
const deleteProfile = async (userId) => {
    const result = await profileRepository.deleteProfile(userId);
    if (result === 0) throw new Error('Profile not found or not deleted');
    return true;
};

module.exports = { createProfile, getProfile, updateProfile, deleteProfile };
