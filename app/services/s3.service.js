const s3Repository = require("../repositories/s3.repository");

const uploadImage = async (path, file) => {
    return await s3Repository.uploadImage(path, file);
};

const deleteImage = async (fileKey) => {
    return await s3Repository.deleteFile(fileKey);
};

const getImage = async (fileKey) => {
    return await s3Repository.getFile(fileKey);
};

const listImages = async () => {
    return await s3Repository.listFiles();
};

module.exports = {
    uploadImage,
    deleteImage,
    getImage,
    listImages,
};
