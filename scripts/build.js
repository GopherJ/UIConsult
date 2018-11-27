const ora = require('ora');
const os = require('os');
const chalk = require('chalk');
const { exec } = require('pkg');

const os_map = {
    'linux'  : 'linux',
    'win32'  : 'win',
    'darwin' : 'osx'
};
const node_version = 8;
const platform = os.platform();

const spinner = ora('Compiling...').start();

const compile = async (target) => {
    return await exec([
        '../src/index.js',
        '--target',
        `node${node_version}-${target}-x64`,
        '--out-dir',
        `../bin/${target}-x64`
    ]);
};

compile(process.env.TARGET_OS || os_map[platform])
    .then(_ => {
        spinner.stop();
        process.stdout.write(chalk.cyan('\n    Build complete!'));
    })
    .catch(_ => {
        spinner.stop();
    });
