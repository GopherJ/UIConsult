/**
 * This is for SPEC_1
 */
import cli from 'caporal';
import FileWalker from '../lib/FileWalker';
import EmailParser from '../lib/EmailParser';
import chalk from 'chalk';
import util from 'util';

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
        return new Date(y, m - 1, d);
    } else if (ymMatches !== null) {
        const [m, y] = ymMatches.slice(1).map(x => +x);
        return new Date(y, m - 1);
    } else if (yMatches !== null) {
        const [y] = yMatches.slice(1).map(x => +x);
        return new Date(y, 0);
    }
};

const _checkDate = (email, options, logger) => {
    if (options.dateFrom) {
        if (_parseDate(options.dateFrom) > email.date) {
            return false;
        }
    }

    if (options.dateTo) {
        if (_parseDate(options.dateTo) < email.date) {
            return false;
        }
    }

    return true;
};

const action = (args, options, logger) => {
    const emails = [];
    FileWalker(args.dir, (err, path, stat, data) => {
        if (err) {
            return logger.error(chalk.red(`Error reading ${path}`));
        } else {
            const email = (new EmailParser(data)).parseAndCreateEmail();
            if (options.dateFrom) {

            }
        }
    });
};

export default {
    alias,
    command,
    argument,
    options,
    action
};

