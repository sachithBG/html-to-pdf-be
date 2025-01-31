const pdfRepository = require('../repositories/pdfManage.repository');
const { PdfTemplate } = require("./vm/pdfTemplate");

// Service method to save PDF
const savePdf = async (name, headerContent, bodyContent, footerContent, json, margin,
    displayHeaderFooter = true, defVal = "-", organization_id, addon_ids, external_key, sections, subcategories) => {
    try {
        // Call repository method to save PDF
        const pdfId = await pdfRepository.savePdf(name, headerContent, bodyContent, footerContent,
            json, margin, displayHeaderFooter, defVal, organization_id, addon_ids, external_key, sections, subcategories);

        return {
            id: pdfId,
            name,
            headerContent,
            bodyContent,
            footerContent,
            json,
            margin,
            displayHeaderFooter,
            defVal
        };
    } catch (error) {
        console.error('Error saving PDF:', error);
        throw new Error(error);
    }
};

// Service method to update PDF
const updatePdf = async (id, name, headerContent, bodyContent, footerContent, json, margin,
    displayHeaderFooter = true, defVal = "-", organization_id, addon_ids, external_key, sections, subcategories) => {
    try {
        
        // Call repository method to update PDF
        const updated = await pdfRepository.updatePdf(id, name, headerContent, bodyContent, footerContent, json,
            margin, displayHeaderFooter, defVal, organization_id, addon_ids, external_key, sections, subcategories);
        if (!updated) {
            throw new Error('PDF not found or failed to update.');
        }

        return {
            id,
            name,
            headerContent,
            bodyContent,
            footerContent,
            json,
            margin,
            displayHeaderFooter,
            defVal
        };
    } catch (error) {
        console.error('Error updating PDF:', error);
        throw new Error(error);//'An error occurred while updating the PDF.'
    }
};

const updateDummyData = async (id, json) => {
    try {
        // Call repository method to update PDF
        const updated = await pdfRepository.updateDummyData(id, json);
        if (!updated) {
            throw new Error('PDF not found or failed to update.');
        }
        return { id };
    } catch (error) {
        console.error('Error updating PDF:', error);
        throw new Error(error);//'An error occurred while updating the PDF.'
    }
};

// Service method to get PDF by ID
const getPdfById = async (id) => {
    try {
        // Call repository method to get PDF by ID
        const pdf = await pdfRepository.getPdfById(id);
        if (!pdf) {
            throw new Error('PDF not found.');
        }
        return new PdfTemplate(pdf);
    } catch (error) {
        console.error('Error retrieving PDF:', error);
        throw new Error(error);//'An error occurred while retrieving the PDF.'
    }
};

// Service method to check for a PDF by name
const getPdfByKey = async (organization_id, key, addon) => {
    try {
        return await pdfRepository.getPdfByKey(organization_id, key, addon);
    } catch (error) {
        throw new Error(error);//'An error occurred while checking the PDF name.'
    }
};

// Service method to get paginated data
const getDataAsPage = async (sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id) => {
    try {
        // Call repository method to get paginated data
        const data = await pdfRepository.getDataAsPage(sortOrder, startFrom, to, sortBy, addonsFilter, search, organization_id);
        return data;
    } catch (error) {
        console.error('Error fetching paginated data:', error);
        throw new Error(error);//'An error occurred while fetching paginated data.'
    }
};

// Service method to delete PDF
const deletePdf = async (id) => {
    try {
        // Call repository method to delete PDF
        const deleted = await pdfRepository.deletePdf(id);
        if (!deleted) {
            throw new Error('PDF not found or failed to delete.');
        }
        return { message: `PDF with ID ${id} deleted successfully.` };
    } catch (error) {
        console.error('Error deleting PDF:', error);
        throw new Error(error);//'An error occurred while deleting the PDF.'
    }
};

const getTemplateByExternalKeyAndAddon = async (externalKey, addonName) => {
    const template = await pdfRepository.getTemplateByExternalKeyAndAddon(externalKey, addonName);
    if (!template) {
        throw new Error('No template found with the given external key and addon name.');
    }
    return template;
};

// Fetch template by ID
const getTemplateById = async (id) => {
    try {
        return await pdfRepository.fetchTemplateById(id);
    } catch (error) {
        console.error("Error in getTemplateById:", error);
        throw new Error("Failed to fetch template by ID.");
    }
};

// Fetch template by Addon ID and external key
const getTemplateByAddon = async (addonId, keyId) => {
    try {
        return await pdfRepository.fetchTemplateByAddon(addonId, keyId);
    } catch (error) {
        console.error("Error in getTemplateByAddon:", error);
        throw new Error("Failed to fetch template by addon ID and external key.");
    }
};

const existsByExternalKey = async (key) => {
    return await pdfRepository.existsByExternalKey(key);
};

const existsByKeyIdNot = async (name, id) => {
    return await pdfRepository.existsByKeyIdNot(name, id);
};

module.exports = {
    savePdf,
    updatePdf,
    getPdfById,
    getPdfByKey,
    getDataAsPage,
    deletePdf,
    getTemplateByExternalKeyAndAddon,
    updateDummyData,
    getTemplateById,
    getTemplateByAddon,
    existsByExternalKey,
    existsByKeyIdNot
}
