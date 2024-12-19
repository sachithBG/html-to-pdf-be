// utils/jwt.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // You should store this securely, e.g., in environment variables
const JWT_EXPIRATION = '1h'; // Access token expiration time (1 hour)
const REFRESH_TOKEN_EXPIRATION = '30d'; // Refresh token expiration time (7 days)

const generateRefreshToken = (userId, username, organizationId,) => {
    try {
        const refreshToken = jwt.sign(
            { userId, organizationId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );
        const accessToken = jwt.sign({ userId, organizationId, username }, process.env.SECRET_KEY, { expiresIn: '1h' });
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
};
