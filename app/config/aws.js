
const AWS_REGION = process.env.AWS_REGION || "your-region";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "your-bucket-name";
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || "your-access-key";
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || "your-secret-key";

module.exports = {
    AWS_REGION,
    S3_BUCKET_NAME,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
};