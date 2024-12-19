CREATE TABLE pdf_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE, -- Unique name field
    header_content LONGTEXT,           -- Use LONGTEXT for larger content
    body_content LONGTEXT,             -- Use LONGTEXT for larger content
    footer_content LONGTEXT,           -- Use LONGTEXT for larger content
    json LONGTEXT,                     -- Use LONGTEXT for large JSON content
    margin JSON,                       -- Store margin as structured JSON data
    displayHeaderFooter BOOLEAN DEFAULT true,   -- Column to control display of header and footer
    defVal VARCHAR(255) DEFAULT '-',             -- Column for the default value
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);


