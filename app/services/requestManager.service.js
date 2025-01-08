const requestManager = require("../repositories/requestManager.repository");
const { monthNames } = require("../utils/constant");

const logRequest = async (organizationId, metadata) => {
    const metadataJson = JSON.stringify(metadata);
    await requestManager.saveRequestLog(organizationId, metadataJson);
};

const getMonthlyPdfRequests = async (organizationId) => {
    const rawData = await requestManager.getMonthlyPdfRequests(organizationId);

    // Transform data into required format
    const formattedData = rawData.map((item) => {
        const [year, month] = item.month.split('-');
        return {
            label: `${monthNames[parseInt(month, 10) - 1]} ${year}`,
            value: item.requests,
        };
    });

    return formattedData;
};

module.exports = { logRequest, getMonthlyPdfRequests };

