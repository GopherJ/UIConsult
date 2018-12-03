/**
 * SPEC_7
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');
const checkDateRange = require('../utils/checkDateRange');
const schema = require('../schema/division');
const generateChart = require('../lib/GenerateChart');

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
    day: {
        var: '-d, --day',
        description: 'Search for the nomber of emails per day',
        type: cli.BOOL
    },
    month: {
        var: '-m, --month',
        description: 'Search for the number of emails per month',
        type: cli.BOOL
    },
    file: {
        var: '-f, --file',
        description: 'The path where the chart will be stored(saved)',
        type: cli.STRING
    }
};

const action = (args, opts, logger) => {
    const spinner = ora(InfoMsg.Loading).start();
    const dates = [];

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();

        const rs = checkDateRange(email, opts, options);
        if (rs instanceof Error) spinner.stop(), logger.error(chalk.red(rs.message)), process.exit(1);
        else {
            dates.push(email.date.valueOf());
        }
    }, () => {
        spinner.stop();

        if(opts.day){
            daySchema['data']['values'] = data;
            generateChart(data, opts.path);
        } else if(opts.month){
            monthSchema['data']['values'] = donnees;
            generateChart(data, opts.path);
        }
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