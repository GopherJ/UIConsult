/**
 * This is for SPEC_1
 */
import cli from 'caporal';
import FileWalker from '../lib/FileWalker';
import EmailParser from '../lib/EmailParser';
import chalk from 'chalk';
import util from 'util';
import table from 'table';

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
    FileWalker(args.dir, (err, path, stat, data) => {
        if (err) {
            return logger.error(chalk.red(`Error reading ${path}`));
        } else {
            const email = (new EmailParser(data)).parseAndCreateEmail();
            if (_checkDate(email, options, logger)) emails.push(email);
        }
    }, () => {
        const tb = [
            ['Subject', 'Date', 'Senders', 'Receivers', 'Content']
        ];

        emails.forEach(email => {
            tb.push([
                email.subject,
                email.date,
                email.sender,
                email.receivers.join(', '),
                email.content
            ]);
        });

        process.stdout.write(table(tb));
    });
};

export default {
    alias,
    command,
    argument,
    options,
    action
};

