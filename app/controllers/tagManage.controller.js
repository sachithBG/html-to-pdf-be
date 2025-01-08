const { validationResult } = require("express-validator");
const tagService = require("../services/tagManage.service");

const saveTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const tag = await tagService.saveTag(req.body);
        res.status(201).json(tag);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const tag = await tagService.updateTag(req.params.id, req.body);
        res.status(200).json(tag);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const findTagById = async (req, res) => {
    try {
        const tag = await tagService.findTagById(req.params.id);
        res.status(200).json(tag);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const findTags = async (req, res) => {
    try {
        const { addon_ids } = req.query;
        const tags = await tagService.findTags(addon_ids
            ? addon_ids.map(id => Number(id))
            : []);
        res.status(200).json(tags);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteTag = async (req, res) => {
    try {
        await tagService.deleteTag(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    saveTag,
    updateTag,
    findTagById,
    findTags,
    deleteTag,
};
