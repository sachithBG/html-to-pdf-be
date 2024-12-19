const jwt = require('jsonwebtoken');
const organizationService = require('../services/organization.service'); // Assuming you have an organization service
const userService = require('../services/user.service'); 

// Middleware to check and validate refresh token
const validateRefreshToken = async (req, res, next) => {
    const refreshToken = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is required' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Check if the user exists
        const user = await userService.getUserById(decoded.userId);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        // Ensure that the user is associated with the provided organization
        const organization = await organizationService.getOrganizationById(decoded.organizationId);
        if (!organization || organization.user_id !== decoded.userId) {
            return res.status(403).json({ message: 'User is not associated with the organization' });
        }

        if (!(organization.user_id == decoded.userId && refreshToken == organization.refresh_token)) {
            return res.status(403).json({ message: 'Invalid refresh token for this user and organization' });
        }

        // If valid, attach decoded user and organization info to the request object
        req.user = decoded;
        req.organizationId = decoded.organizationId; // Store organizationId for use in routes

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

module.exports = validateRefreshToken;
