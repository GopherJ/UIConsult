/**
 * SPEC_7
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');
const checkDateRange = require('../utils/checkDateRange');
const schema = require('../schema/repartition');
const generateAndOpenChart = require('../lib/GenerateAndOpenChart');
const checkExt = require('../utils/checkExt');

const {
    isUndefined,
    parseEmailAddr
} = require('../utils');

const alias = 'nbmc';

const command = {
    name: 'nbemailscolab',
    description: 'Display the number of emails sent from all the collaborators on a daily or a monthly basis'
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
    file: {
        var: '-f, --file',
        description: 'The path where the chart will be stored(saved)',
        type: cli.STRING
    }
};

const action = (args, opts, logger) => {
    if (isUndefined(opts.file)) logger.error(chalk.red(ErrMsg.OPTION_IS_REQUIRED(options.file.var))), process.exit(1);

    const rsExt = checkExt(opts.file, options);
    if (rsExt instanceof Error) logger.error(chalk.red(rsExt.message)), process.exit(1)

    const spinner = ora(InfoMsg.Loading).start();
    const m = new Map();

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();

        const rsDate = checkDateRange(email, opts, options);

        if (rsDate instanceof Error) spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else m.has(email.sender) ? m.set(email.sender, m.get(email.sender) + 1) : m.set(email.sender, 1);
    }, () => {
        spinner.stop();

        schema['data']['values'] = [...m].map(x =>({employee: parseEmailAddr(x[0]), sent: x[1]}));
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
