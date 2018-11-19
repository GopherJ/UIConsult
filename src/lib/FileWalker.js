const walk = require('walkdir');
const fs = require('fs');

/**
 *
 * @param dir
 * @param {function} file
 * @param {function} end
 */
module.exports = (dir, file, end) => {
    const emitter = walk(dir);

    emitter.on('file', (path, stat) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) file(err, path, stat, null);
            else file(null, path, stat, data);
        });
    });

    emitter.on('end', end);
};