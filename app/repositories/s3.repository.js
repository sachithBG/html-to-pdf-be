const { S3Client, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { AWS_REGION, S3_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY } = require("../config/aws");

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
});

const uploadFile = async (file) => {
    const fileUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${file.key}`;
    return fileUrl;
};

const deleteFile = async (fileKey) => {
    const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
    });
    await s3.send(command);
    return { message: "File deleted successfully." };
};

// Retrieve a single file URL
const getFile = async (fileKey) => {
    const fileUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileKey}`;
    return fileUrl;
};

// List files in the bucket
const listFiles = async () => {
    const command = new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
    });
    const response = await s3.send(command);
    return response.Contents.map((file) => ({
        key: file.Key,
        lastModified: file.LastModified,
        size: file.Size,
    }));
};

module.exports = {
    uploadFile,
    deleteFile,
    getFile,
    listFiles,
};
