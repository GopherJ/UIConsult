/*
 * walk and read files recursivly
 *
 * @Author: Cheng JIANG 
 * @Date: 2018-11-23 12:47:22 
 * @Last Modified by: Cheng JIANG
 * @Last Modified time: 2018-11-27 22:30:51
 */

const fs = require('fs');
const path = require('path');

const { walk } = require('walk');

/**
 *
 * @param dir
 * @param {function} file
 * @param {function} end
 * @param {function} err
 */

module.exports = (dir, file, end, err) => {
    const emitter = walk(dir, {});

    emitter.on('file', (root, stat, next) => {
        const absPath = path.join(root, stat.name);

        fs.readFile(absPath, 'utf8', (err, data) => {
            if (err) file(err, absPath, null), next();
            else file(null, absPath, data), next();
        });
    });

    emitter.on('directoryError', (root, _, next) => {
        err(root), next();
    });

    emitter.on('end', end);
};
