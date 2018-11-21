const fs = require('fs');
const { walk } = require('walk');

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
        fs.readFile(stat.name, 'utf8', (err, data) => {
            if (err) file(err, root, stat, null), next();
            else file(null, root, stat, data), next();
        });
    });

    emitter.on('errors', (root, nodeStatsArray, next) => {
        error(root, nodeStatsArray), next();
    });

    emitter.on('end', end);
};
