const htmlTableService = require('../services/dynamicHtmlTable.service');
const tagService = require('../services/tagManage.service');

const createHtmlTable = async (req, res) => {
    let tagId = null;
    try {
        const tableData = req.body;
        const tag = await tagService.saveTag({
            name: tableData.name + " (Table)", organization_id: tableData.organization_id,
            field_path: tableData.tag.field_path + "._table_", tag_type: 'TABLE', addon_ids: tableData.addon_ids
        });
        tagId = tag.id;
        tableData.tag = tag;
        tableData.tag_id = tag.id;
        const newTable = await htmlTableService.createHtmlTable(tableData);
        res.status(201).json(newTable);
    } catch (error) {
        if (tagId) tagService.deleteTag(tagId);
        res.status(500).json({ error: error.message });
    }
};

const updateHtmlTable = async (req, res) => {
    let tagId = null;
    try {
        const id = req.params.id;
        const tableData = req.body;
        const tag = await tagService.updateTag(tableData.tag.id, {
            name: tableData.name + " (Table)", organization_id: tableData.organization_id,
            field_path: tableData.tag?.field_path + "._table_", tag_type: 'TABLE', addon_ids: tableData.addon_ids
        });
        tagId = tag.id;
        tableData.tag = tag;
        tableData.tag_id = tag.id;
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
            const tag = await tagService.findTagById(table.tag_id);
            table.tag = tag;
            res.status(200).json(table);
        } else {
            res.status(404).json({ message: "Table not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDataAsPage = async (req, res) => {
    try {
        const { sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id } = req.query;
        if (!organization_id) {
            return res.status(404).json({
                error: 'Organization id required',
            });
        }
        // Call service to get paginated data
        const data = await htmlTableService.getDataAsPage(sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id);

        res.status(200).json({
            message: 'Data fetched successfully!',
            data,
        });
    } catch (error) {
        console.error('Error fetching paginated data:', error);
        res.status(500).json({
            error: 'An error occurred while fetching the data.',
            details: error.message,
        });
    }
};

const deleteHtmlTable = async (req, res) => {
    try {
        const id = req.params.id;
        const tbl = await htmlTableService.getHtmlTableById(id);
        await htmlTableService.deleteHtmlTable(id);
        await tagService.deleteTag(tbl.tag_id);
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
    getDataAsPage,
    deleteHtmlTable,
};
