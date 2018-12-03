/**
 * SPEC_3
 * 
 * @author Cherchour Liece
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
    isOutsideWorkingHours,
    descendingByIdx,
    formatDate
} = require('../utils');

const {
    exchanged
} = require('../utils/constants');

const alias = 'bsd';

const command = {
    name: 'busydays',
    description: "Displays the list of the 10 days selected and the number of emails sent (outside working hours) for these days."
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
    const busyDays = new Map();

    // create table, detect terminal's width and use the width and table head
    // to init a correct table
    const tb = new Table([
        'Rank',
        'Day',
        'Exchanged Emails'
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
        const rsEmployee = checkEmployeeName(email, args);        
        
        // error
        if (rsDate instanceof Error) 
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if (rsEmployee instanceof Error) 
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsEmployee.message)), process.exit(1);
        // no error
        else if (rsDate) {
            if(rsEmployee == exchanged.SENT && isOutsideWorkingHours(email.date)) {
                const date = formatDate(email.date);

                if (busyDays.has(date))
                    busyDays.set(date, busyDays.get(date) + 1);
                else
                    busyDays.set(date, 1);
            }
        }
    }, () => {
        // file walker ends correctly
        // stop spinner
        spinner.stop();

        // add a table row, every item must be string otherwise if fails to add
        // more info => Table.js
        const busyDaysArrays = [...busyDays].sort(descendingByIdx(1)).slice(0, 10);

        busyDaysArrays.forEach((v, k) => {
            tb.push([
                (k+1).toString(),
                v[0],
                v[1].toString()
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