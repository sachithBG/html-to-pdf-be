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
);