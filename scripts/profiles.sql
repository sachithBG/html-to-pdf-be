CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,                 -- Unique identifier for each profile
    user_id INT NOT NULL UNIQUE,                       -- Links to the users table (one-to-one relationship)
    theme ENUM('dark', 'light') DEFAULT 'light',       -- Preferred theme for the user
    avatar VARCHAR(255) DEFAULT NULL,                 -- URL/path to the profile image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Tracks when the profile was created
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tracks last update
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) CHARSET=utf8mb4;