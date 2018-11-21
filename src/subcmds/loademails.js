/**
 * This is for SPEC_1
 */
const cli = require('caporal');
const chalk = require('chalk');
const util = require('util');

const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');

const alias = 'lms';

const command = {
    name: 'loademails',
    description: 'Load all emails of specific period'
};

const argument = {
    var: '<dir>',
    description: 'Directory which store email texts'
};

const options = [
    {
        var: '-df, --date-from',
        description: 'Start date',
        type: cli.STRING
    },
    {
        var: '-dt, --date-to',
        description: 'End date',
        type: cli.STRING
    }
];

const _parseDate = dateStr => {
    const yRe = /^([0-9]{4})$/;
    const ymRe = /^([0-9]{2})\/([0-9]{4})$/;
    const ymdRe = /^([0-9]){2}\/([0-9]{2})\/([0-9]{4})$/;

    const ymdMatches = dateStr.match(ymdRe);
    const ymMatches = dateStr.match(ymRe);
    const yMatches = dateStr.match(yRe);

    if (ymdMatches !== null) {
        const [d, m, y] = ymdMatches.slice(1).map(x => +x);
        if (m < 1 || m > 12) {
            return 'Invalid Month';
        }

        if (d < 1 || d > new Date(y, m, 0).getDate()) {
            return 'Invalid Day';
        }

        return new Date(y, m - 1, d);
    } else if (ymMatches !== null) {
        const [m, y] = ymMatches.slice(1).map(x => +x);
        if (m < 1 || m > 12) {
            return 'Invalid Month';
        }

        return new Date(y, m - 1);
    } else if (yMatches !== null) {
        const [y] = yMatches.slice(1).map(x => +x);
        return new Date(y, 0);
    } else {
        return 'Invalid Date';
    }
};

const _checkDate = (email, options, logger) => {
    if (options.dateFrom) {
        const res = _parseDate(options.dateFrom);

        if (util.isDate(res)) {
            if (res > email.date) return false;
        } else {
            logger.error(chalk.red('Start Date: ' + res));
            process.exit(1);
        }
    }

    if (options.dateTo) {
        const res = _parseDate(options.dateTo);

        if (util.isDate(res)) {
            if (res < email.date) return false;
        } else {
            logger.error(chalk.red('End Date: ' + res));
            process.exit(1);
        }
    }

    return true;
};


const action = (args, options, logger) => {
    const emails = [];

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) {
            return logger.error(chalk.red(`Error reading ${absPath}`));
        } else {
            const email = (new EmailParser(data)).parseAndCreateEmail();
            if (_checkDate(email, options, logger)) emails.push(email);
        }
    }, () => {
        process.stdout.write(JSON.stringify(emails, null, 4));
    });
};

module.exports = {
    alias,
    command,
    argument,
    options,
    action
};