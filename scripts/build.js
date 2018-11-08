const config = require('../config/webpack.config');
const webpack = require('webpack');
const { exec } = require('pkg');

process.env.NODE_ENV = 'production';

const ora = require('ora');
const path = require('path');
const chalk = require('chalk');


const spinner = ora('building for production...');
spinner.start();

webpack(config, (err, stats) => {
    spinner.stop();

    if (err) throw err;
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'));
        process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'))
});


