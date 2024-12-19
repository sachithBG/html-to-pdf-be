const tagRepository = require("../repositories/tagManage.repository");

const saveTag = async (tagData) => {
    const { field_path } = tagData;

    if (await tagRepository.existByKey(field_path)) {
        throw new Error("Tag with the same key already exists.");
    }

    return await tagRepository.saveTag(tagData);
};

const updateTag = async (id, tagData) => {
    const { field_path } = tagData;

    if (await tagRepository.existByKeyAndId(id, field_path)) {
        throw new Error("Tag with the same key already exists.");
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

const findTags = async () => {
    return await tagRepository.findTags();
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
