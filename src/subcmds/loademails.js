/**
 * This is for SPEC_1
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');

const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const EmailList = require('../lib/EmailList');
const ErrMsg = require('../lib/ErrMsg');
const InfoMsg = require('../lib/InfoMsg');

const { 
    isInRange, 
    isNull, 
    isUndefined,
    lastDayOfMonth, 
    isNumber
} = require('../utils');

const alias = 'lms';

const command = {
    name: 'loademails',
    description: 'Load all emails of specific period'
};

const argument = {
    var: '<dir>',
    description: 'Directory which store email texts'
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

const parseDate = (dateStr, isDateFrom) => {
    const re = /^(?:([0-9]{1,2})\/)?(?:([0-9]{1,2})\/)?(?:([0-9]{4}))$/;
    const matches = dateStr.match(re);
    const VAR = isDateFrom ? options.dateFrom.var : options.dateTo.var;

    if (!isNull(matches)) {
        const [
            d,
            m,
            y
        ] = matches.slice(1).map(x => +x);

        if (!isNumber(m) && !isNumber(d)) {
            return new Date(y, 0);
        } else if (!isNumber(m)) {
            if (!isInRange([1, 12], d)) {
                return new Error(ErrMsg.OPTION_OUT_OF_RANGE(VAR));
            } else {
                return new Date(y, d - 1, 0);
            }
        } else {
            if (!isInRange([1, lastDayOfMonth(m, y)], d) || !isInRange([1, 12], m)) {
                return new Error(ErrMsg.OPTION_OUT_OF_RANGE(VAR));
            } else {
                return new Date(y, m - 1, d);
            }
        }
    } else {
        return new Error(ErrMsg.OPTION_INVALID_FORMAT(VAR));
    }
};

const checkDateInRange = (email, options, logger) => {
    const { dateFrom, dateTo } = options;
    const { date } = email;

    if (isUndefined(dateFrom) && isUndefined(dateTo)) {
        return true;
    } else if (isUndefined(dateTo)) {
        const rs = parseDate(dateFrom, true);
        if (rs instanceof Error) {
            logger.error(chalk.red(rs.message));
            process.exit(1);
        } else if(rs > date) {
            return false;
        } 

        return true;
    } else if (isUndefined(dateFrom)) {
        const rs = parseDate(dateTo, false);
        if (rs instanceof Error) {
            logger.error(chalk.red(rs.message));
            process.exit(1);
        } else if(rs < date) {
            return false;
        } 

        return true;
    }

    const rsFrom = parseDate(dateFrom, true);
    const rsTo = parseDate(dateTo, false);

    if (rsFrom instanceof Error) {
        logger.error(chalk.red(rsFrom.message));
        process.exit(1);
    }

    if (rsTo instanceof Error) {
        logger.error(chalk.red(rsTo.message));
        process.exit(1);
    }

    if (rsFrom > date || rsTo < date) return false;
    else return true;
};


const action = (args, options, logger) => {
    const emailList = new EmailList();
    const spinner = ora(InfoMsg.Loading).start();

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();
        
        if (checkDateInRange(email, options, logger)) emailList.push(email);
    }, () => {
        spinner.stop();
        process.stdout.write(emailList.toString());
    }, path => {
        spinner.stop();
        logger.error(chalk.red(ErrMsg.IO_PERMISSION_DENIED(path)));
    });
};

module.exports = {
    alias,
    command,
    argument,
    options,
    action
};