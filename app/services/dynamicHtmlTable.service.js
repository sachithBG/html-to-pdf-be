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

const deleteHtmlTable = async (id) => {
    await htmlTableRepository.deleteHtmlTable(id);
};

module.exports = {
    createHtmlTable,
    updateHtmlTable,
    getHtmlTables,
    getHtmlTableById,
    deleteHtmlTable,
};
