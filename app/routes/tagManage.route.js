const express = require("express");
const router = express.Router();
const { validationResult, check } = require("express-validator");
const authenticateToken = require("../middleware/auth");
const {
    saveTag,
    updateTag,
    findTagById,
    findTags,
    deleteTag,
} = require("../controllers/tagManage.controller");

// Validation rules 
const validateTag = [
    check("name").notEmpty().withMessage("Name is required."),
    check("organization_id").notEmpty().withMessage("Organization is required."),
    check("field_path").notEmpty().withMessage("Field path is required."),
    check("tag_type").isIn(["TABLE", "CONTENT", "IMAGE"]).withMessage("Type must be TABLE, CONTENT, or IMAGE."),
    check("addon_ids").isArray().withMessage("Addon IDs must be an array."),
];

// Routes
router.post("/", authenticateToken, validateTag, saveTag);
router.put("/:id", authenticateToken, validateTag, updateTag);
router.get("/", authenticateToken, findTags);
router.get("/:id", authenticateToken, findTagById);
router.delete("/:id", authenticateToken, deleteTag);

module.exports = router;
