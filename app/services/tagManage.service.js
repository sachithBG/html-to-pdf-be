const tagRepository = require("../repositories/tagManage.repository");

const saveTag = async (tagData) => {
    const { field_path, tag_type, organization_id } = tagData;

    if (await tagRepository.existByKeyAndOrg(field_path, organization_id)) {
        throw new Error("Tag with the same key already exists.");
    }
    if (tag_type == 'TABLE') {
        tagData.field_path = field_path.endsWith("._table_")
            ? field_path : `${field_path.replace(/\._table_$/, "")}._table_`;
    }
    return await tagRepository.saveTag(tagData);
};

const updateTag = async (id, tagData) => {
    const { field_path, tag_type, organization_id } = tagData;

    if (await tagRepository.existByKeyAndId(id, field_path, organization_id)) {
        throw new Error("Tag with the same key already exists.");
    }
    if (tag_type == 'TABLE') {
        tagData.field_path = field_path.endsWith("._table_")
            ? field_path : `${field_path.replace(/\._table_$/, "")}._table_`;
    }
    return await tagRepository.updateTag(id, tagData);
};

const findTagById = async (id) => {
    const tag = await tagRepository.findTagById(id);

    if (!tag) {
        throw new Error("Tag not found.");
    }

    return tag;
};

const findTags = async (addon_ids, organization_id) => {
    return await tagRepository.findTags(addon_ids, organization_id);
};

const deleteTag = async (id) => {
    return await tagRepository.deleteTag(id);
};

module.exports = {
    saveTag,
    updateTag,
    findTagById,
    findTags,
    deleteTag,
};
