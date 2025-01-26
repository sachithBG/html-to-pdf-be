const { validationResult } = require("express-validator");
const tagService = require("../services/tagManage.service");
const MediaService = require('../services/mediaLocale.service');
const mediaService = new MediaService();

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
        const { addon_ids, organization_id } = req.query;
        const tags = await tagService.findTags(addon_ids
            ? addon_ids.map(id => Number(id))
            : [], organization_id);
        const imgs = await mediaService.getAllMediaByOrganization(organization_id, addon_ids || []);
        // {
        //     "id": 62,
        //         "organization_id": 11,
        //             "name": "AssertId",
        //                 "field_path": "JobOrder.asset.id",
        //                     "tag_type": "CONTENT",
        //                         "addon_ids": [
        //                             32,
        //                             31
        //                         ],
        //                             "created_at": "2025-01-26T11:31:18.000Z",
        //                                 "updated_at": "2025-01-26T11:31:18.000Z"
        // }
        for (img of imgs) {
            tags.push({
                id: img.id,
                organization_id: img.organization_id,
                name: img.name,
                field_path: img.url,
                tag_type: 'IMAGE',
                addon_ids: img.addon_ids,
                created_at: img.created_at,
                updated_at: img.updated_at
            });
        }
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
