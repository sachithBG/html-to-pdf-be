const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { AWS_REGION, S3_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY } = require("../config/aws");

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
});

const createMulterMiddleware = ({ bucketName, path: uploadPath }) => {
    return multer({
        storage: multerS3({
            s3,
            bucket: bucketName,
            acl: 'public-read', // Adjust permissions as needed
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                const fileName = `${uploadPath}/${Date.now()}-${file.originalname}`;
                cb(null, fileName);
            },
        }),
    });
};

const uploadAvtor = createMulterMiddleware({
    bucketName: S3_BUCKET_NAME,
    path: 'profile', // Dynamic path
});

 const uploadLogo = createMulterMiddleware({
    bucketName: S3_BUCKET_NAME,
    path: 'logo', // Dynamic path
});

const uploadMedia = createMulterMiddleware({
    bucketName: S3_BUCKET_NAME,
    path: 'media', // Dynamic path
});

// const upload = multer({

//     storage: multerS3({
//         s3,
//         bucket:  S3_BUCKET_NAME,
//         acl: "public-read", // or private depending on your requirements
//         metadata: (req, file, cb) => {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: (req, file, cb) => {
//             const fileName = path + `/${Date.now()}-${file.originalname}`;
//             cb(null, fileName);
//         },
//     }),
// });



module.exports = { uploadAvtor, uploadLogo, uploadMedia };
