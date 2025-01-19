CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,                -- Unique identifier for each user
    name VARCHAR(255) NOT NULL,                        -- Name of the user
    -- username VARCHAR(255) NOT NULL UNIQUE,            -- Unique username for the user
    email VARCHAR(255) NOT NULL UNIQUE,               -- Unique email address
    password VARCHAR(255) NOT NULL,                   -- Hashed password for security
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',        -- Role of the user (ADMIN, USER)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Tracks when the user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Tracks last update
) CHARSET=utf8mb4;

CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,                 -- Unique identifier for each profile
    user_id INT NOT NULL UNIQUE,                       -- Links to the users table (one-to-one relationship)
    theme ENUM('dark', 'light') DEFAULT 'light',       -- Preferred theme for the user
    avatar VARCHAR(255) DEFAULT NULL,                 -- URL/path to the profile image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Tracks when the profile was created
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tracks last update
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) CHARSET=utf8mb4;

CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,                 -- Unique identifier for each organization
    user_id INT NOT NULL,                              -- Links to the user who owns the organization
    name VARCHAR(255) NOT NULL,                       -- Organization name (unique across users)
    refresh_token VARCHAR(255) DEFAULT NULL,            -- Store refresh token for each organization
    is_default BOOLEAN DEFAULT FALSE,                  -- Indicates if the organization is the default organization for the user
    logo VARCHAR(255) DEFAULT NULL,                     -- Store logo URL for each organization
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Tracks when the organization was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tracks last update
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(name, user_id)                             -- Unique combination of name and user_id
) CHARSET=utf8mb4;

CREATE TABLE addons (
    id INT AUTO_INCREMENT PRIMARY KEY,                   -- Unique identifier for each addon
    organization_id INT NOT NULL,                        -- Links to the organization that owns the addon
    name VARCHAR(255) NOT NULL,                          -- Addon name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Tracks when the addon was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tracks the last update time
    UNIQUE (organization_id, name),                      -- Ensures unique addon names within the same organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) CHARSET=utf8mb4;

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-incremented ID
    organization_id INT NOT NULL,  -- Organization ID, foreign key to organizations
    name VARCHAR(255) NOT NULL,  -- Name of the tag
    field_path VARCHAR(128) NOT NULL,  -- Unique field path for the tag (e.g., "user-role", "content-draft")
    tag_type ENUM('TABLE', 'CONTENT', 'IMAGE') NOT NULL,  -- ENUM for tag type (TABLE, CONTENT, IMAGE)
    addon_ids JSON NOT NULL,  -- JSON data for additional IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the tag is created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Timestamp for last update
    FOREIGN KEY (organization_id) REFERENCES organizations(id),  -- Foreign key constraint to organizations
    UNIQUE (organization_id, field_path)  -- Unique combination of organization_id and field_path
) CHARSET=utf8mb4;

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

CREATE TABLE `html_tables_addons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,      -- Unique identifier for each record
    `html_table_id` INT NOT NULL,           -- Foreign key referencing the html_tables table
    `addon_id` INT NOT NULL,                  -- Foreign key referencing the addons table
    FOREIGN KEY (`html_table_id`) REFERENCES `html_tables`(`id`),  -- Ensure html_tables_id exists in the html_tables table
    FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`)                 -- Ensure addon_id exists in the addons table
) CHARSET=utf8mb4;


CREATE TABLE pdf_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    header_content LONGTEXT,
    body_content LONGTEXT,
    footer_content LONGTEXT,
    json LONGTEXT,
    margin JSON,
    displayHeaderFooter BOOLEAN DEFAULT true,
    defVal VARCHAR(255) DEFAULT '-',
    external_key VARCHAR(255) NOT NULL,
    sections JSON DEFAULT NULL, 
    subcategories JSON DEFAULT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
) CHARSET=utf8mb4;

CREATE TABLE `pdf_template_addons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,      -- Unique identifier for each record
    `pdf_template_id` INT NOT NULL,           -- Foreign key referencing the pdf_templates table
    `addon_id` INT NOT NULL,                  -- Foreign key referencing the addons table
    FOREIGN KEY (`pdf_template_id`) REFERENCES `pdf_templates`(`id`),  -- Ensure pdf_template_id exists in the pdf_templates table
    FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`)                 -- Ensure addon_id exists in the addons table
) CHARSET=utf8mb4;

CREATE TABLE pdf_request_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,  --  tracking organization IDs
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata JSON DEFAULT NULL     -- Store additional info as JSON (e.g., template name, parameters)
);

CREATE TABLE `external_keys` (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each external key
    addon_id INT NOT NULL,              -- Foreign key referencing the addon table
    key_value VARCHAR(255) NOT NULL,     -- Unique key identifier for the external system
    UNIQUE KEY `unique_addon_key` (`addon_id`, `key_value`), -- Enforces uniqueness for addon_id and keyValue
    FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`)  -- Ensures addon_id exists in the addons table
) CHARSET=utf8mb4;

CREATE TABLE media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_key VARCHAR(255) NOT NULL UNIQUE,
    addon_ids JSON DEFAULT NULL,
    url VARCHAR(255) NOT NULL,
    organization_id INT NOT NULL,
    file_type ENUM('PROFILE', 'LOGO', 'MEDIA') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)  -- Foreign key constraint to organizations
) CHARSET=utf8mb4;