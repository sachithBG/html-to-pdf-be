const htmlTableService = require('../services/dynamicHtmlTable.service');

const createHtmlTable = async (req, res) => {
    try {
        const tableData = req.body;
        const newTable = await htmlTableService.createHtmlTable(tableData);
        res.status(201).json(newTable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateHtmlTable = async (req, res) => {
    try {
        const id = req.params.id;
        const tableData = req.body;
        const updatedTable = await htmlTableService.updateHtmlTable(id, tableData);
        res.status(200).json(updatedTable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHtmlTables = async (req, res) => {
    try {
        // Fetch the organization_id from the query parameter
        const organization_id = req.query.organization_id;

        // Check if organization_id is provided, otherwise return an error
        if (!organization_id) {
            return res.status(400).json({ message: "organization_id is required" });
        }
        const tables = await htmlTableService.getHtmlTables(organization_id);
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHtmlTableById = async (req, res) => {
    try {
        const id = req.params.id;
        const table = await htmlTableService.getHtmlTableById(id);
        if (table) {
            res.status(200).json(table);
        } else {
            res.status(404).json({ message: "Table not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteHtmlTable = async (req, res) => {
    try {
        const id = req.params.id;
        await htmlTableService.deleteHtmlTable(id);
        res.status(200).json({ message: "Table deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createHtmlTable,
    updateHtmlTable,
    getHtmlTables,
    getHtmlTableById,
    deleteHtmlTable,
};
