const ErrMsg = require('../msg/ErrMsg');
const path = require('path');
const { EXTENSION } = require('../utils/constants');

const checkExt = (filePath, options) => {
    const ext = path.extname(filePath);

    switch(ext) {
    case EXTENSION.SVG:
    case EXTENSION.PNG:
        return true;
    default:
        return new Error(ErrMsg.PATH_INVALID_EXT(options.file.var));
    }
};

module.exports = checkExt;