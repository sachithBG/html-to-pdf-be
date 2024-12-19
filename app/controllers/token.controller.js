const tokenService = require("../services/token.service");

const generateTokens = async (req, res) => {
    const { organizationId } = req.query;

    try {
        // Validate organizationId
        if (!organizationId) {
            return res.status(400).json({ message: 'Organization ID is required.' });
        }

        const orgId = Number(organizationId);
        if (isNaN(orgId) || orgId <= 0) {
            return res.status(400).json({ message: 'Invalid organization ID.' });
        }

        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await tokenService.generateTokens(req.user.id, req.user.username, orgId);

        // Send the tokens as response
        res.json({ accessToken, refreshToken });

    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({ message: 'Error generating tokens', error: error.message });
    }
};


module.exports = {
    generateTokens
};
