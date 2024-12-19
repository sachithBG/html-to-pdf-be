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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE `pdf_template_addons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,      -- Unique identifier for each record
    `pdf_template_id` INT NOT NULL,           -- Foreign key referencing the pdf_templates table
    `addon_id` INT NOT NULL,                  -- Foreign key referencing the addons table
    FOREIGN KEY (`pdf_template_id`) REFERENCES `pdf_templates`(`id`),  -- Ensure pdf_template_id exists in the pdf_templates table
    FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`)                 -- Ensure addon_id exists in the addons table
);

