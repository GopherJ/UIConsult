const fs = require('fs');
const { walk } = require('walk');
const path = require('path');

/**
 *
 * @param dir
 * @param {function} file
 * @param {function} end
 * @param {function} error
 */

module.exports = (dir, file, end, error) => {
    const emitter = walk(dir, {});

    emitter.on('file', (root, stat, next) => {
        const absPath = path.join(root, stat.name);

        fs.readFile(absPath, 'utf8', (err, data) => {
            if (err) file(err, absPath, null), next();
            else file(null, absPath, data), next();
        });
    });

    emitter.on('errors', (root, nodeStatsArray, next) => {
        error(root, nodeStatsArray), next();
    });

    emitter.on('end', end);
};
