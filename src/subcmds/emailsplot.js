/**
 * SPEC_6
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
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');
const checkDateRange = require('../utils/checkDateRange');
const checkEmployeeName = require('../utils/checkEmployeeName');
const schema = require('../schema/exchanged');
const createServerWithSchema = require('../lib/HttpServer');
const {
    isUndefined,
    parseEmployeeName,
    updateTimeUnit
} = require('../utils');
const {
    exchanged,
    vegaTimeUnits,
} = require('../utils/constants');

const alias = 'emp';

const command = {
    name: 'exchangeplot',
    description: "Have a visual representation of the employee interactions."
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
    },
    frequency: {
        var: '-f, --frequency',
        description: 'Frequency (time unit)',
        type: cli.STRING,
        default: 'monthdate'
    }
};

const action = (args, opts, logger) => {
    // start the spinner
    const spinner = ora(InfoMsg.Loading).start();

    // initialisation
    const exchangedEmails = [];
    const { SENT, RECEIVED } = exchanged;

    // create table, detect terminal's width and use the width and table head
    // to init a correct table

    // start to read file recursively
    FileWalker(args.dir, (err, absPath, data) => {
        // failed to read a file
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        // email parser instance
        const emailParser = new EmailParser(data);
        // parse email and return an Email instance
        const email = emailParser.parseAndCreateEmail();

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
        else if (!vegaTimeUnits.includes(opts.frequency)) {
            spinner.stop(), logger.error(chalk.red(ErrMsg.OPTION_INVALID_FORMAT(options.frequency.var))), process.exit(1);
        }
        else {
            updateTimeUnit(schema, opts.frequency);

            switch(rsEmployee) {
            case SENT:
                exchangedEmails.push({
                    date: email.date.valueOf(),
                    exchanged: 'Sent'
                });
                break;
            case RECEIVED:
                exchangedEmails.push({
                    date: email.date.valueOf(),
                    exchanged: 'Recv'
                });
                break;
            default:
                break;
            };
        }
    }, () => {
        // file walker ends correctly
        // stop spinner
        spinner.stop();
        //Svg
        schema['title']= `${parseEmployeeName(args.employee)}'s communication activity`
        schema['data']['values'] = exchangedEmails;
        createServerWithSchema(schema);
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
