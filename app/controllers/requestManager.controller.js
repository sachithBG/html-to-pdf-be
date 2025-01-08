const requestManager = require("../services/requestManager.service");

const logPdfRequest = async (organizationId, metadata) => {
    try {
        await requestManager.logRequest(organizationId, metadata);
    } catch (error) {
        console.error("Error logging PDF request:", error);
        throw error;
    }
};

const getMonthlyPdfRequestData = async (req, res) => {
    try {
        const { organizationId } = req.query;

        // Validate organizationId
        if (!organizationId) {
            return res.status(400).json({ message: "Organization ID is required." });
        }

        if (isNaN(organizationId)) {
            return res.status(400).json({ message: "Organization ID must be a valid number." });
        }

        // Fetch data
        const data = await requestManager.getMonthlyPdfRequests(organizationId);

        // Handle case where no data is found
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No data found for the specified organization." });
        }

        // Success response
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching monthly PDF request data:", error);
        res.status(500).json({ message: "Failed to fetch data." });
    }
};

module.exports = { logPdfRequest, getMonthlyPdfRequestData };
