import walk from 'walkdir';
import fs from 'fs';

export default (dir, cb) => {
    walk(dir, (path, stat) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) cb(err, path, stat, null);
            else cb(null, path, stat, data);
        });
    });
};



