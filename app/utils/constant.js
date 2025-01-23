const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
}

const FILE_TYPE = { 
    PROFILE: 'PROFILE',
    LOGO: 'LOGO',
    MEDIA: 'MEDIA'
}

const THEME = {
    DARK: 'dark',
    LIGHT: 'light'
}

const TAG_TYPES = {
    TABLE: 'TABLE',
    CONTENT: 'CONTENT',
    IMAGE: 'IMAGE',
}

module.exports = {
    monthNames,
    THEME,
    FILE_TYPE,
    ROLES,
    TAG_TYPES
}