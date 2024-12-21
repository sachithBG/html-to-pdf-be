const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const s3Controller = require("../controllers/s3.controller");

// API for uploading a profile image
router.post("/upload/profile", upload.single("image"), s3Controller.uploadProfileImage);

// API for deleting a file
router.delete("/delete/:fileKey", s3Controller.deleteImage);

// API for retrieving a single file URL
router.get("/get/:fileKey", s3Controller.getImage);

// API for listing all files in the bucket
router.get("/list", s3Controller.listImages);

module.exports = router;
