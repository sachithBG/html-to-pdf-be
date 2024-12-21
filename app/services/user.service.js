const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const profileService = require('./profile.service');
const { JWT_EXPIRATION } = require('../utils/jwt');



// Register user
const registerUser = async (name, email, password, role = 'USER') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userRepository.createUser(name, email, hashedPassword, role);
    if (userId) {
        try {
            await profileService.createProfile(userId, 'light', null);
        } catch (error) {
            console.log(error);
        }
    }
    return userId;
};

// Login user
const loginUser = async (email, password, rememberMe) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, name: user.name }, process.env.SECRET_KEY, { expiresIn: rememberMe & Boolean(rememberMe) ? '30d' : JWT_EXPIRATION });
    try {
        const profile = await profileService.getProfile(user.id);
        user.profile = profile ? { id: profile.id, theme: profile.theme, avatar: profile.avatar }
            : { id: null, theme: null, avatar: null };
    } catch (error) {
        // console.log(error);
    }
    return {
        token, user: {
            id: user.id, name: user.name, email: user.email, role: user.role, profile: user.profile
        }
    };
};

// Get user by ID
const getUserById = async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) throw new Error('User not found');
    return user;
};

// Update user
const updateUser = async (id, name, email, password) => {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const result = await userRepository.updateUser(id, name, email, hashedPassword);
    if (result === 0) throw new Error('User not found or not updated');
    return true;
};

// Update user name
const updateUserName = async (id, name) => {
    const result = await userRepository.updateUserName(id, name);
    if (result === 0) throw new Error('User not found or not updated');
    return true;
};

// Delete user
const deleteUser = async (id) => {
    const result = await userRepository.deleteUser(id);
    if (result === 0) throw new Error('User not found or not deleted');
    return true;
};

module.exports = { registerUser, loginUser, getUserById, updateUser, deleteUser, updateUserName };
