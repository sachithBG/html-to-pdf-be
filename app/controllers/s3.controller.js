const s3Service = require("../services/s3.service");

const uploadProfileImage = async (req, res) => {
    try {
        const fileUrl = await s3Service.uploadImage(req.file);
        res.status(201).json({ message: "File uploaded successfully.", fileUrl });
    } catch (error) {
        res.status(500).json({ message: "File upload failed.", error: error.message });
    }
};

const deleteImage = async (req, res) => {
    try {
        const { fileKey } = req.params;
        const response = await s3Service.deleteImage(fileKey);
        res.status(200).json(response);
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
};
