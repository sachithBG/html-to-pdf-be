const { MediaRepository } = require("../repositories/mediaLocale.repository");

class MediaService {
    constructor() {
        this.mediaRepository = new MediaRepository();
    }

    async createMedia(mediaData) {
        return this.mediaRepository.createMedia(mediaData);
    }

    async getMediaById(id) {
        return this.mediaRepository.getMediaById(id);
    }

    async getAllMediaByOrganization(organization_id, addon_ids) {
        return this.mediaRepository.getAllMediaByOrganization(organization_id, addon_ids);
    }

    async getProfileImg(organization_id) {
        return this.mediaRepository.getProfileImg(organization_id);
    }

    async updateMedia(id, updates) {
        return this.mediaRepository.updateMedia(id, updates);
    }

    async deleteMedia(id) {
        return this.mediaRepository.deleteMedia(id);
    }

    async deleteMediaByKey(fileKey) {
        return this.mediaRepository.deleteMediaByKey(fileKey);
    }

    async deleteMediaByOrgId(orgId) {
        return this.mediaRepository.deleteMediaByOrgId(orgId);
    }
}

module.exports = MediaService;
