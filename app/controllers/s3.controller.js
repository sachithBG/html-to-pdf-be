const s3Service = require("../services/s3.service");
const organizationService = require('../services/organization.service');
const MediaService = require('../services/mediaLocale.service');
const profileService = require('../services/profile.service');
const mediaService = new MediaService();

const uploadProfileImage = async (req, res) => {
    let currentImg = null, err = null;
    try {
        const { organizationId, name } = req.query;
        currentImg = req.file;
        const file = req.file;
        const usr = JSON.parse(req.user?.user);
        currentImg = await mediaService.getMediaByUrl(usr?.profile?.avatar);
        if (!currentImg) {
            currentImg = req.file;
        }
        mediaService.createMedia({ name: name || 'Profile Image', file_key: file.key, addon_ids: [], url: file.location, organization_id: organizationId, file_type: 'PROFILE' });
        profileService.updateProfileAvatarV2(req.user?.id, file.location);
        res.status(201).json({ message: "File uploaded successfully.", file: file.location });
    } catch (error) {
        err = error;
        res.status(500).json({ message: "File upload failed.", error: error.message });
    } finally {
        try {
            if (currentImg && err) {
                if (!currentImg.location && currentImg.id) {
                    mediaService.deleteMediaByUrl(currentImg.id);
                    s3Service.deleteImage(currentImg.file_key);
                } else if (currentImg.key) {
                    s3Service.deleteImage(currentImg.key);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
};

const uploadOrgLogo = async (req, res) => {
    let currentImg = null, err = null;
    try {
        const file = req.file;
        const { organizationId, name } = req.query;
        if (!file) {
            return res.status(404).json({ message: "Image not found." });
        }
        // organizationService.updateOrganizationV2(organizationId, name, file?.location); 
        currentImg = await mediaService.getProfileImg(organizationId);
        mediaService.createMedia({ name, file_key: file.key, addon_ids: [], url: file.location, organization_id: organizationId, file_type: 'LOGO' });
        res.status(201).json({ message: "File uploaded successfully.", url: file?.location });
    } catch (error) {
        err = error;
        res.status(500).json({ message: "File upload failed.", error: error.message });
    } finally {
        try {
            if (currentImg?.id && !err) {
                mediaService.deleteMedia(currentImg.id);
                s3Service.deleteImage(currentImg.file_key);
            }
        } catch (e) {
            console.error(e);
        }
    }
};

const uploadOrgMedia = async (req, res) => {
    let file = null;
    try {
        const { addon_ids, organization_id, name } = req.query;
        file = req.file;// await s3Service.uploadImage(req.file);
        if (!file) {
            return res.status(404).json({ message: "Image not found." });
        }
        const resData = await mediaService.createMedia({ name, file_key: file.key, addon_ids, url: file.location, organization_id, file_type: 'MEDIA' });
        const data = { file_key: file.key, addon_ids, url: file.location, organization_id, file_type: 'MEDIA', id: resData.id };
        res.status(201).json({ message: "File uploaded successfully.", data });
    } catch (error) {
        if (file?.key) {
            s3Service.deleteImage(file.key);
        }
        res.status(500).json({ message: "File upload failed.", error: error.message });
    }
};

const deleteImage = async (req, res) => {
    try {
        const { fileKey } = req.query;
        const response = await s3Service.deleteImage(fileKey);
        mediaService.deleteMediaByKey(fileKey);
        res.status(204).json(response);
    } catch (error) {
        res.status(500).json({ message: "Failed to delete the file.", error: error.message });
    }
};

const getImage = async (req, res) => {
    try {
        const { fileKey } = req.params;
        const fileUrl = await s3Service.getImage(fileKey);
        res.status(200).json({ fileUrl });
    } catch (error) {
        res.status(500).json({ message: "Failed to get the file.", error: error.message });
    }
};

const listImages = async (req, res) => {
    try {
        const files = await s3Service.listImages();
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: "Failed to list files.", error: error.message });
    }
};

module.exports = {
    uploadProfileImage,
    deleteImage,
    getImage,
    listImages,
    uploadOrgLogo,
    uploadOrgMedia
};
