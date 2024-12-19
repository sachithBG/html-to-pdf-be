CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,                 -- Unique identifier for each organization
    user_id INT NOT NULL,                              -- Links to the user who owns the organization
    name VARCHAR(255) NOT NULL,                       -- Organization name (unique across users)
    refresh_token VARCHAR(255) DEFAULT NULL,            -- Store refresh token for each organization
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Tracks when the organization was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tracks last update
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
