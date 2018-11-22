/**
 * SPEC_2
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');

const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const Table = require('../lib/Table');

const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');

const { 
    isInRange, 
    isNull, 
    isUndefined,
    lastDayOfMonth, 
    isArrayAndHasLength,
    isNumber
} = require('../utils');

const exchanged = {
    SENT: Symbol(),
    RECEIVED: Symbol(),
    NONE: Symbol()
};

const alias = 'nms';

const command = {
    name: 'nbemails',
    description: "Show an employee's exchanged emails' statistics of specific period"
};

const argument = {
    var: '<dir>',
    description: 'Directory where store emails'
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
    employee: {
        var: '-E, --employee',
        description: "Employee's fullname",
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

const checkDateInRange = (email, options) => {
    const { dateFrom, dateTo } = options;
    const { date } = email;

    if (isUndefined(dateFrom) && isUndefined(dateTo)) {
        return true;
    } else if (isUndefined(dateTo)) {
        const rs = parseDate(dateFrom, true);

        if (rs instanceof Error) return rs;
        if(rs > date) return false;
        return true;
    } else if (isUndefined(dateFrom)) {
        const rs = parseDate(dateTo, false);

        if (rs instanceof Error) return rs;
        if(rs < date) return false;
        return true;
    }

    const rsFrom = parseDate(dateFrom, true);
    const rsTo = parseDate(dateTo, false);

    if (rsFrom instanceof Error) return rsFrom;
    if (rsTo instanceof Error) return rsTo
    if (rsFrom > date || rsTo < date) return false;
    return true;
};

const testName = (firstName, lastName, emailAddr) => {
        const ref = new RegExp(firstName, 'i');
        const rel = new RegExp(lastName, 'i');

        if (ref.test(emailAddr) && rel.test(emailAddr)) return true;
        return false;
};

const checkEmployeeName = (email, options) => {
    const { employee } = options;
    const { sender, receivers } = email;

    const re = /^(\w+)(?: +)(\w+)$/;
    const matches = employee.match(re);

    if (!isNull(matches)) {
        const {
            firstName,
            lastName
        } = matches.slice(1);

        if (testName(firstName, lastName, sender)) 
            return exchanged.SENT;
        else if (isArrayAndHasLength(receivers) && receivers.some(r => testName(firstName, lastName, r))) 
            return exchanged.RECEIVED;
        else 
            return exchanged.NONE;
    } else {
        return new Error(ErrMsg.OPTION_INVALID_FORMAT(options.employee.var));
    }
};

const action = (args, options, logger) => {
    const spinner = ora(InfoMsg.Loading).start();

    let sent = 0;
    let received = 0;

    const tb = new Table([
        'Employee Name',
        'Time Period',
        'Sent Emails',
        'Received Emails',
        'Total of exchanged Emails'
    ]);

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();

        const rsDate = checkDateInRange(email, options);
        const rsEmployee = checkEmployeeName(email, options);

        if (rsDate instanceof Error) 
            spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if (rsEmployee instanceof Error) 
            spinner.stop(), logger.error(chalk.red(rsEmployee.message)), process.exit(1);
        else if (rsDate) {
            switch(rsEmployee) {
                case exchanged.SENT:
                    sent += 1;
                    break;
                case exchanged.RECEIVED:
                    received += 1;
                    break;
                default:
                    break;
            }
        }
    }, () => {
        spinner.stop();

        tb.push([
            options.employee, 
            options.dateFrom || ''   + ' - ' + options.dateTo || '',
            sent,
            received,
            sent + received
        ]);
        process.stdout.write(tb.toString());
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