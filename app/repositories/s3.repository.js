const { S3Client, PutObjectCommand , GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { AWS_REGION, S3_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY } = require("../config/aws");
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
});

const uploadImage = async (path, file) => {
    const fileExtension = file.originalname.split('.').pop();  // Get the file extension
    const fileKey = `${uuidv4()}.${fileExtension}`;  // Create a unique file name
    const Body = await file.buffer;
    const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        BucketKeyEnabled: true,
        Key: path+'/'+ fileKey,
        Body: Body,
        ContentType: file.mimetype,
        ACL: 'public-read',  // Optional: make the file publicly accessible
    };

    try {
        // Upload the image to S3
        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);
        // await s3.send(command);

        // Construct file URL
        const fileUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${path + '/' + fileKey}`;
        return { fileUrl, fileKey };
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('File upload failed');
    }
};
const uploadFile_ = async (file) => {
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
    deleteFile,
    getFile,
    listFiles,
    uploadImage
};
