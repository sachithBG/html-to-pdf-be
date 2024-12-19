const { generateRefreshToken, verifyToken } = require('../utils/jwt');
const tokenRepository = require('../repositories/token.repository');

// Generate new access and refresh tokens for the organization
const generateTokens = async (userId, username, organizationId) => {
    const { accessToken, refreshToken } = generateRefreshToken(userId, username, organizationId);
    // Store the refresh token in the database
    await tokenRepository.saveRefreshToken(organizationId, refreshToken);

    return { accessToken, refreshToken };
};

module.exports = {
    generateTokens
};
