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

    async getMediaByUrl(url) {
        return this.mediaRepository.getMediaByUrl(url);
    }

    async getAllMediaByOrganization(organization_id, addon_ids) {
        return this.mediaRepository.getAllMediaByOrganization(organization_id, addon_ids);
    }

    async getProfileImg(userId) {
        return this.mediaRepository.getProfileImg(userId);
    }

    async getOrgLogo(userId) {
        return this.mediaRepository.getOrgLogo(userId);
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

    async deleteMediaByUrl(url) {
        return this.mediaRepository.deleteMediaByUrl(url);
    }

    async deleteMediaByOrgId(orgId) {
        return this.mediaRepository.deleteMediaByOrgId(orgId);
    }
}

module.exports = MediaService;
