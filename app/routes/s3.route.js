const express = require("express");
const router = express.Router();
const { uploadAvtor, uploadLogo, uploadMedia } = require("../middleware/multer");
const s3Controller = require("../controllers/s3.controller");
const authenticateToken = require("../middleware/auth"); 

// API for uploading a profile image
router.post("/upload/profile", authenticateToken, uploadAvtor.single("avatar"), s3Controller.uploadProfileImage);

// API for uploading a org logo
router.post("/upload/org/logo", authenticateToken, uploadLogo.single("logo"), s3Controller.uploadOrgLogo);

// API for uploading a org media
router.post("/media/upload", authenticateToken, uploadMedia.single("media"), s3Controller.uploadOrgMedia);

// API for deleting a file
router.delete("/delete/img", authenticateToken, s3Controller.deleteImage);

// API for retrieving a single file URL
router.get("/get/:fileKey", s3Controller.getImage);

// API for listing all files in the bucket
router.get("/list", s3Controller.listImages);

module.exports = router;
