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
        this.external_key = data.external_key ? Number(data.external_key) : undefined
    }
}

module.exports = { PdfTemplate };