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

alter table organizations add column logo VARCHAR(255) DEFAULT NULL;