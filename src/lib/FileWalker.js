import walk from 'walkdir';
import fs from 'fs';

/**
 *
 * @param dir
 * @param cb
 * @param cbend
 */
export default (dir, cb, cbend) => {
    const emitter = walk(dir);
    emitter.on('file', (path, stat) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) cb(err, path, stat, null);
            else cb(null, path, stat, data);
        });
    });

    emitter.on('end', cbend);
};



