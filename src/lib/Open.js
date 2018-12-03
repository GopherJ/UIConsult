/**
 * script for opening files, webpages
 *
 * @param {String} path
 * @return {void}
 */

const os = require('os');

const { spawn } = require('child_process');

const Open = path => {
    switch (os.platform()) {
    case 'darwin':
        spawn('start', [path]);
        break;
    case 'linux':
        spawn('xdg-open', [path]);
        break;
    case 'win32':
        spawn('cmd.exe', ['/c', 'start', path]);
        break;
    }
};

module.exports = Open;
