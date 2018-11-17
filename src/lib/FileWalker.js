import walk from 'walkdir';
import fs from 'fs';

export default function(dir, cb) {
    walk(dir, function (path, stat) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) cb(err, path, stat, null);
            else cb(null, path, stat, data);
        });
    });
};



