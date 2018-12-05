/*
 * SPEC_1
 *
 * @Author: Cheng JIANG 
 * @Date: 2018-12-02 13:37:42 
 * @Last Modified by: Cheng JIANG
 * @Last Modified time: 2018-12-05 14:52:33
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const EmailList = require('../lib/EmailList');
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');
const checkDateRange = require('../utils/checkDateRange');

const alias = 'lms';

const command = {
    name: 'loademails',
    description: 'Load emails of specific period'
};

const arguments = [
    {
        var: '<dir>',
        description: 'Directory where store emails'
    }
];

const options = {
    dateFrom: {
        var: '-s, --date-from',
        description: 'Start date',
        type: cli.STRING
    },
    dateTo: {
        var: '-e, --date-to',
        description: 'End date',
        type: cli.STRING
    }
};

const action = (args, opts, logger) => {
    const emailList = new EmailList();
    const spinner = ora(InfoMsg.Loading).start();

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();

        const rs = checkDateRange(email, opts, options);
        if (rs instanceof Error) spinner.stop(), logger.error(chalk.red(rs.message)), process.exit(1);
        else if (rs) emailList.push(email);
    }, () => {
        spinner.stop();
        process.stdout.write(emailList.toString());
    }, path => {
        spinner.stop();
        logger.error(chalk.red(ErrMsg.IO_PERMISSION_DENIED(path)));
    });
};

module.exports = {
    alias,
    command,
    arguments,
    options,
    action
};