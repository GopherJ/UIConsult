/*
 * SPEC_2
 *
 * @Author: Cheng JIANG
 * @Date: 2018-11-24 15:29:35
 * @Last Modified by: Cheng JIANG
 * @Last Modified time: 2018-12-03 18:34:27
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const Table = require('../lib/Table');
const checkDateRange = require('../utils/checkDateRange');
const checkEmployeeName = require('../utils/checkEmployeeName');
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');

const {
    parseEmployeeName
} = require('../utils');
const {
    exchanged
} = require('../utils/constants');

const alias = 'nms';

const command = {
    name: 'nbemails',
    description: "Show an employee's exchanged emails' statistics of specific period"
};

const arguments = {
    dir: {
        var: '<dir>',
        description: 'Directory where store emails'
    },
    employee: {
        var: '<employee>',
        description: "Employee's fullname"
    }
};

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
    // start the spinner
    const spinner = ora(InfoMsg.Loading).start();

    // intialisation
    let sent = 0;
    let received = 0;

    // create table, detect terminal's width and use the width and table head
    // to init a correct table
    const tb = new Table([
        'Employee Name',
        'Time Period',
        'Sent Emails',
        'Received Emails',
        'Total of exchanged Emails'
    ]);

    // start to read file recursively
    FileWalker(args.dir, (err, absPath, data) => {
        // failed to read a file
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        // email parser instance
        const emailParser = new EmailParser(data);
        // parse email and return an Email instance
        const email = emailParser.parseAndCreateEmail();

        // check date, if there is an error then bubble up
        const rsDate = checkDateRange(email, opts, options);
        // check employee's name, if there is an error then bubble up
        const rsEmployee = checkEmployeeName(email, args, arguments);

        // error
        if (rsDate instanceof Error)
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if (rsEmployee instanceof Error)
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsEmployee.message)), process.exit(1);
        // no error
        else if (rsDate) {
            switch(rsEmployee) {
            case exchanged.SENT:
                sent += 1;
                break;
            case exchanged.RECEIVED:
                received += 1;
                break;
            default:
                break;
            }
        }
    }, () => {
        // file walker ends correctly
        // stop spinner
        spinner.stop();

        // add a table row, every item must be string otherwise if fails to add
        // more info => Table.js
        tb.push([
            parseEmployeeName(args.employee),
            (opts.dateFrom || '').trim()  + ' - ' + (opts.dateTo || '').trim(),
            sent.toString(),
            received.toString(),
            (sent + received).toString()
        ]);

        // print table
        process.stdout.write(tb.toString());
    }, path => {
        // file walker ends with an error of permission
        // it fails to read a directory
        // stop spinner
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
