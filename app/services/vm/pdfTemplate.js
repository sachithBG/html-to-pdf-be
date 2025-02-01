class PdfTemplate {
    constructor(data) {
        this.id = data.id;
        this.organization_id = data.organization_id;
        this.name = data.name;
        this.headerContent = data.header_content;
        this.bodyContent = data.body_content;
        this.footerContent = data.footer_content;
        this.json = data.json;
        this.margin = data.margin;
        this.displayHeaderFooter = data.displayHeaderFooter;
        this.defVal = data.defVal;
        this.created_at = data.created_at;
        this.modified_at = data.modified_at;
        this.addon_id = data.addon_id;
        this.addon_name = data.addon_name;
        this.addons = data.addons;
        this.external_key_id = data.external_key_id ? Number(data.external_key_id) : undefined;
        this.sections = data.sections;
        this.subcategories = data.subcategories;
    }
}

module.exports = { PdfTemplate };