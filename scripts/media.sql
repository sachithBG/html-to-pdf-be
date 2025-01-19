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
