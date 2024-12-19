CREATE TABLE html_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-incremented ID
    organization_id INT NOT NULL,       -- Organization ID, foreign key to organizations
    name VARCHAR(255) NOT NULL,         -- Name of the HTML table
    custom_html LONGTEXT NOT NULL,      -- Stores the "customHtml" field from JSON
    table_rows JSON NOT NULL,           -- Renamed from "rows" to "table_rows" (stores the "rows" field as a JSON array)
    cell_styles JSON NOT NULL,          -- Stores the "cellStyles" field as a JSON array
    num_columns INT NOT NULL,           -- Stores the "numColumns" field
    addon_ids JSON NOT NULL,            -- Stores addon IDs as a JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the table is created
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Timestamp for last update
    FOREIGN KEY (organization_id) REFERENCES organizations(id)  -- Foreign key constraint to organizations
);