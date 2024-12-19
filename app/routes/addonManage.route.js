const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authenticateToken = require("../middleware/auth");
const {
    createAddon,
    updateAddon,
    getAddonById,
    getAllAddons,
    deleteAddon,
} = require("../controllers/addonManage.controller");

const validateAddon = [check("name").notEmpty().withMessage("Name is required.")];

router.post("/", authenticateToken, validateAddon, createAddon);
router.put("/:id", authenticateToken, validateAddon, updateAddon);
router.get("/", authenticateToken, getAllAddons);
router.get("/:id", authenticateToken, getAddonById);
router.delete("/:id", authenticateToken, deleteAddon);

module.exports = router;
