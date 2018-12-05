/**
 * SPEC_8
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');
const schema = require('../schema/frequency');
const checkDateRange = require('../utils/checkDateRange');
const checkEmpolyeeNameInOption = require('../utils/checkEmployeeNameInOption');
const generateAndOpenChart = require('../lib/GenerateAndOpenChart');
const checkExt = require('../utils/checkExt');

const {
    isUndefined,
    parseEmployeeName
} = require('../utils');
const {
    exchanged: { SENT }
} = require('../utils/constants');

const alias = 'fmu';

const command = {
    name: 'freqemailuser',
    description: 'Access the frequency of a user’s sent emails on a period of time'
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
    },
    employee: {
        var: '--employee',
        description: 'search by user name',
        type: cli.STRING
    },
    file: {
        var: '-f, --file',
        description: 'The path where the chart will be stored(saved)',
        type: cli.STRING
    }
};

const action = (args, opts, logger) => {
    if (isUndefined(opts.employee)) logger.error(chalk.red(ErrMsg.OPTION_IS_REQUIRED(options.employee.var))), process.exit(1);
    if (isUndefined(opts.file)) logger.error(chalk.red(ErrMsg.OPTION_IS_REQUIRED(options.file.var))), process.exit(1);

    const rsExt = checkExt(opts.file, options);
    if (rsExt instanceof Error) logger.error(chalk.red(rsExt.message)), process.exit(1)

    const spinner = ora(InfoMsg.Loading).start();

    const circles = [];

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();

        const rsDate = checkDateRange(email, opts, options);
        const rsEmployee = checkEmpolyeeNameInOption(email, opts, options);
        if (rsDate instanceof Error) spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if(rsEmployee instanceof Error) spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if (rsDate && rsEmployee === SENT) circles.push({ date: email.date.valueOf() });
    }, () => {
        spinner.stop();
        schema['data']['values'] = circles;
        schema['title'] = `${parseEmployeeName(opts.employee)}'s sent emails frequency`;

        generateAndOpenChart(schema, opts.file);
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
