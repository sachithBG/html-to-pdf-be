// utils/jwt.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // You should store this securely, e.g., in environment variables
const JWT_EXPIRATION = '2d'; // Access token expiration time (2 days)
// Refresh token expiration time (6 months)
const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 180;

const generateRefreshToken = (userId, name, organizationId,) => {
    try {
        const refreshToken = jwt.sign(
            { userId, organizationId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );
        const accessToken = jwt.sign({ userId, organizationId, name }, process.env.SECRET_KEY, { expiresIn: JWT_EXPIRATION });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error('Error generating tokens: ' + error.message);
    }
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateRefreshToken,
    verifyToken,
    JWT_EXPIRATION,
};
