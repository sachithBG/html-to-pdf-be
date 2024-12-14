

const saveTableTada = async (tableData) => {
    if (!tableData) {
        return res.status(400).json({
            message: "No table data provided.",
        });
    }
    const { rows, cellStyles, customHtml, numColumns } = tableData;

    return { ...tableData, id: Math.floor(Math.random(2)) }
}

const updateTableTada = async (id, tableData) => {
    const { rows, cellStyles, customHtml, numColumns } = tableData;
    return { ...tableData, id: id }
}

const getTableDataById = async (id) => {
    return {
        id: id,
        "customHtml": "<table style=\"width: 100%; border-collapse: collapse; margin: 20px 0;\">\n                        <thead>\n                            <tr style=\"background-color: #007bff; color: #ffffff;\">\n                                <th style=\"border: 1px solid #ddd; padding: 8px; text-align: left;\">Header 1</th>\n                                <th style=\"border: 1px solid #ddd; padding: 8px; text-align: left;\">Header 2</th>\n                                <th style=\"border: 1px solid #ddd; padding: 8px; text-align: left;\">Header 3</th>\n                            </tr>\n                        </thead><tbody></tbody></table>",
        "rows": [
            {
                "col1": "Data 1",
                "col2": "Data 2",
                "col3": "Data 3"
            }
        ],
        "cellStyles": [
            {
                "backgroundColor": "#f4f4f4",
                "fontSize": "14",
                "padding": "8px",
                "color": "#000"
            },
            {
                "backgroundColor": "#f4f4f4",
                "fontSize": "14",
                "padding": "8px",
                "color": "#000"
            },
            {
                "backgroundColor": "#f4f4f4",
                "fontSize": "14",
                "padding": "8px",
                "color": "#000"
            }
        ],
        "numColumns": 3
    }
}

const deleteTableData = async (id) => {

}

module.exports = {
    saveTableTada,
    updateTableTada,
    getTableDataById,
    deleteTableData
}