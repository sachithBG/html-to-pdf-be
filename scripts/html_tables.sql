CREATE TABLE html_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-incremented ID
    organization_id INT NOT NULL,       -- Organization ID, foreign key to organizations
    name VARCHAR(255) NOT NULL,         -- Name of the HTML table
    custom_html LONGTEXT NOT NULL,      -- Stores the "customHtml" field from JSON
    table_rows JSON NOT NULL,           -- Renamed from "rows" to "table_rows" (stores the "rows" field as a JSON array)
    cell_styles JSON NOT NULL,          -- Stores the "cellStyles" field as a JSON array
    num_columns INT NOT NULL,           -- Stores the "numColumns" field
    addon_ids JSON NOT NULL,            -- Stores addon IDs as a JSON array
    tag_id INT NOT NULL UNIQUE,
    col_keys JSON NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the table is created
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Timestamp for last update
    FOREIGN KEY (organization_id) REFERENCES organizations(id)  -- Foreign key constraint to organizations
) CHARSET=utf8mb4;

-- ALTER TABLE html_tables ADD COLUMN tag_id INT NOT NULL;
-- ALTER TABLE html_tables ADD COLUMN col_keys JSON NOT NULL;

CREATE TABLE `html_tables_addons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,      -- Unique identifier for each record
    `html_table_id` INT NOT NULL,           -- Foreign key referencing the html_tables table
    `addon_id` INT NOT NULL,                  -- Foreign key referencing the addons table
    FOREIGN KEY (`html_table_id`) REFERENCES `html_tables`(`id`),  -- Ensure html_tables_id exists in the html_tables table
    FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`)                 -- Ensure addon_id exists in the addons table
) CHARSET=utf8mb4;
