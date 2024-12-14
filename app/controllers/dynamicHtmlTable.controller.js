
const { saveTableTada, getTableDataById } = require("../services/dynamicHtmlTable.service");

const saveTblData = async (req, res) => {
    try {
        res.json({
            message: "Table saved successfully!",
            data: await saveTableTada(req.body),
        });
    } catch (error) {
        console.error("Error saving table data:", error);
        res.status(500).json({
            message: "An error occurred while saving the table.",
        });
    }
}

const updateTblData = async (req, res) => {
    try {
        if (!req?.query?.id || !req.body) {
            return res.status(400).json({
                message: "No table data provided.",
            });
        }
        res.json({
            message: "Table saved successfully!",
            data: await updateTblData(req?.query?.id, req.body),
        });
    } catch (error) {
        console.error("Error saving table data:", error);
        res.status(500).json({
            message: "An error occurred while saving the table.",
        });
    }
}

const getTblDataById = async (req, res) => {
    let { id, bodyContent, footerContent } = req.body;

    // Generate HTML table preview using the data from the frontend
    const tableHtml = await getTableDataById(id);

    // You could save the data to the database or perform other operations here

    // For this example, we just return the generated HTML table preview
    res.json({
        htmlPreview: tableHtml,
    });
}

const deleteTblData = async (req, res) => {
    if (!req?.query?.id) {
        return res.status(400).json({
            message: "No table data provided.",
        });
    }
    await deleteTblData(req.query.id)

    res.json({
        message: "Table deleted successfully!"
    });
}



module.exports = {
    getTblDataById,
    saveTblData,
    updateTblData,
    deleteTblData
}