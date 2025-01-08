const db = require('../config/db');

const saveRequestLog = async (organizationId, metadataJson) => {
    const query = "INSERT INTO pdf_request_logs (organization_id, metadata) VALUES (?, ?)";
    await db.execute(query, [organizationId, metadataJson]);
};

const getMonthlyPdfRequests = async (organization_id) => {
    const query = `
        WITH months AS (
            SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m') AS month
            FROM (
                SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
                UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
                UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
            ) AS numbers
        )
        SELECT 
            m.month, 
            IFNULL(COUNT(pl.id), 0) AS requests
        FROM months m
        LEFT JOIN pdf_request_logs pl 
        ON DATE_FORMAT(pl.timestamp, '%Y-%m') = m.month 
        AND pl.organization_id = ?
        GROUP BY m.month
        ORDER BY m.month;
    `;
    const [rows] = await db.query(query, [Number(organization_id)]);
    return rows;
};


module.exports = { saveRequestLog, getMonthlyPdfRequests };
