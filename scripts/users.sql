CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,                -- Unique identifier for each user
    username VARCHAR(255) NOT NULL UNIQUE,            -- Unique username for the user
    email VARCHAR(255) NOT NULL UNIQUE,               -- Unique email address
    password VARCHAR(255) NOT NULL,                   -- Hashed password for security
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Tracks when the user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Tracks last update
);

