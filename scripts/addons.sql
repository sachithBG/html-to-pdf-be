CREATE TABLE addons (
    id INT AUTO_INCREMENT PRIMARY KEY,                   -- Unique identifier for each addon
    organization_id INT NOT NULL,                        -- Links to the organization that owns the addon
    name VARCHAR(255) NOT NULL,                          -- Addon name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Tracks when the addon was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tracks the last update time
    UNIQUE (organization_id, name),                      -- Ensures unique addon names within the same organization
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) CHARSET=utf8mb4;
