const { walk } = require('walk');
const fs = require('fs');

/**
 *
 * @param dir
 * @param {function} file
 * @param {function} end
 */
module.exports = (dir, file, end) => {
    const emitter = walk(dir, {});

    emitter.on('file', (root, stat, next) => {
        fs.readFile(stat.name, 'utf8', (err, data) => {
            if (err) file(err, root, stat, null), next();
            else file(null, root, stat, data), next();
        });
    });

    emitter.on('errors', (root, nodeStatsArray, next) => {
        next();
    });

    emitter.on('end', end);
};
