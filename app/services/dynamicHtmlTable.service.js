const htmlTableRepository = require('../repositories/dynamicHtmlTable.repository');

const createHtmlTable = async (tableData) => {
    return await htmlTableRepository.createHtmlTable(tableData);
};

const updateHtmlTable = async (id, tableData) => {
    return await htmlTableRepository.updateHtmlTable(id, tableData);
};

const getHtmlTables = async (organization_id) => {
    return await htmlTableRepository.getHtmlTables(organization_id);
};

const getHtmlTableById = async (id) => {
    return await htmlTableRepository.getHtmlTableById(id);
};

// Service method to get paginated data
const getDataAsPage = async (sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id) => {
    try {
        // Call repository method to get paginated data
        const data = await htmlTableRepository.getDataAsPage(sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id);
        return data;
    } catch (error) {
        console.error('Error fetching paginated data:', error);
        throw new Error(error);//'An error occurred while fetching paginated data.'
    }
};

const deleteHtmlTable = async (id) => {
    await htmlTableRepository.deleteHtmlTable(id);
};

module.exports = {
    createHtmlTable,
    updateHtmlTable,
    getHtmlTables,
    getHtmlTableById,
    getDataAsPage,
    deleteHtmlTable,
};
