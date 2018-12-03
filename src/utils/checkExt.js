const ErrMsg = require('../msg/ErrMsg');
const path = require('path');

const checkExt = (filePath, options) => {
    const ext = path.extname(filePath);

    switch(ext) {
    case '':
    case '.':
        return new Error(ErrMsg.PATH_INVALID_EXT(options.file.var));
    case 'svg':
    case 'png':
        return true;
    default:
        return false;
    }
};

module.exports = checkExt;