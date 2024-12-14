
const express = require("express");
const router = express.Router();
const { getTblDataById, saveTblData, updateTblData, deleteTblData } = require("../controllers/dynamicHtmlTable.controller");

router.post("/", saveTblData);
router.put("/", updateTblData);

router.get("/:id", getTblDataById);
router.delete("/", deleteTblData);



module.exports = router;