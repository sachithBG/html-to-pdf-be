CREATE TABLE pdf_request_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,  --  tracking organization IDs
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata JSON DEFAULT NULL     -- Store additional info as JSON (e.g., template name, parameters)
);
