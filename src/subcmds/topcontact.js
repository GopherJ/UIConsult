/**
 * SPEC_4
 *
 * @author Cherchour Liece
 *
 * Edit: Cheng JIANG
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const Table = require('../lib/Table');
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');
const checkDateRange = require('../utils/checkDateRange');
const checkEmployeeName = require('../utils/checkEmployeeName');

const {
    parseEmailAddr,
    descendingByIdxProp
} = require('../utils');

const {
    exchanged
} = require('../utils/constants');

const alias = 'tpc';

const command = {
    name: 'topcontact',
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

    // initialisation
    const contacts = new Map();
    const { SENT, RECEIVED, BOTH } = exchanged;

    // create table, detect terminal's width and use the width and table head
    // to init a correct table
    const tb = new Table([
        'Rank',
        'Employee Name',
        'Sent Emails',
        'Recv Emails',
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

        // check employee's name, if there is an error then bubble up
        const rsDate = checkDateRange(email, opts, options);
        const rsEmployee = checkEmployeeName(email, args);

        if (rsDate instanceof Error)
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if (rsEmployee instanceof Error)
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsEmployee.message)), process.exit(1);
        // no error
        else {
            switch(rsEmployee) {
            // Map {email_addr => {sent: a, recv: b, exchanged: c}}
            case SENT:
                email.receivers.forEach(addr => {
                if (contacts.has(addr))
                    contacts.get(addr)[RECEIVED] += 1, contacts.get(addr)[BOTH] += 1;
                else
                    contacts.set(addr, {[RECEIVED]: 1, [BOTH]: 1, [SENT]: 0});
                });
                break;
            case RECEIVED:
                const { sender } = email;

                if (contacts.has(sender))
                    contacts.get(sender)[SENT] += 1, contacts.get(sender)[BOTH] += 1;
                else
                    contacts.set(sender, {[SENT]: 1, [BOTH]: 1, [RECEIVED]: 0});
                break;
            default:
                break;
            }
        }
    }, () => {
        // file walker endsenderNames correctly
        // stop spinner
        spinner.stop();

        // add a table row, every item must be string otherwise if fails to add
        // more info => Table.js
        const contactsArray = [...contacts].sort(descendingByIdxProp(1, BOTH)).slice(0, 10);
        contactsArray.forEach((v, k) => {
            tb.push([
                (k+1).toString(),
                parseEmailAddr(v[0]),
                v[1][SENT].toString(),
                v[1][RECEIVED].toString(),
                v[1][BOTH].toString()
            ]);
        });

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
