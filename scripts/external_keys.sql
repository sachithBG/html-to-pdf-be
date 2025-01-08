CREATE TABLE `external_keys` (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each external key
    addon_id INT NOT NULL,              -- Foreign key referencing the addon table
    key_value VARCHAR(255) NOT NULL,     -- Unique key identifier for the external system
    UNIQUE KEY `unique_addon_key` (`addon_id`, `key_value`), -- Enforces uniqueness for addon_id and keyValue
    FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`)  -- Ensures addon_id exists in the addons table
) CHARSET=utf8mb4;