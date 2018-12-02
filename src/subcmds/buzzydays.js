/**
 * Spec 3 
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

const { 
    isInRange, 
    isNull, 
    isUndefined,
    lastDayOfMonth, 
    isArrayAndHasLength,
    isNumber,
    getHour,
    getTodaysDate,
    sortDescending
} = require('../utils');

/**
 * state for describing that it's an email sent or received by an employee
 */
const exchanged = {
    SENT: Symbol(),
    RECEIVED: Symbol(),
    NONE: Symbol()
};

const alias = 'bzd';

const command = {
    name: 'buzzydays',
    description: "Displays the list of the 10 days selected and the number of emails sent (outside working hours) for these days."
};

const arguments = {
    dir: {
        var: '<dir>',
        description: 'Directory where emails is stored'
    }, 
    employee: {
        var: '<employee>',
        description: "An employee's fullname"
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

let buzzyDaysArrays = [];

/**
 * 
 * parse date string
 * 
 * e.g. '2018', '1/12/2018', '12/2018', '01/12/2018' will be valid date string,
 * it will return an instance of `Date`
 * 
 * otherwise, it will return an instance of `Error` with an explication,
 * e.g. '1/13/2018'  => Out Of Range
 *      '30/02/2018' => Out Of Range
 *      'abc'        => Invalid Format
 * 
 * to make the error explication more precise, the second parameter is
 * necessary so that we know it's an error of the start date or the end date
 * 
 * @param {String} dateStr 
 * @param {Boolean} isDateFrom 
 * @return {Error|Date}
 */
const parseDate = (dateStr, isDateFrom) => {
    const re = /^\s*(?:([0-9]{1,2})\/)?(?:([0-9]{1,2})\/)?(?:([0-9]{4}))\s*$/;
    const matches = dateStr.match(re);
    const VAR = isDateFrom ? options.dateFrom.var : options.dateTo.var;

    // matches correctly the regexp
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


/**
 * 
 * check if an email's date is in the date range which is parsed from
 * caporal options.
 * 
 * it will also bubble up the error of parsing date string so that we can
 * log correctly the error.
 * 
 * @param {Email} email 
 * @param {Caporal.options} options 
 * @return  {Error|Boolean}
 */
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
/**
 * Check if an email has been sent or received outside workings hours
 * @param {*} email An employee's sent or received email
 */
const outsideWorkingHours = email => {
    const WorkingHours1 = "08:01";
    const WorkingHours2 = "21:59";

    let hoursEmail = getHour(email);
    if(hoursEmail > WorkingHours1 && hoursEmail < WorkingHours2)
    {
        return false
    }
    else
    {
        return true;
    }

}

/**
 * 
 * check if employee's name is included in email address
 * 
 * ToDo: parse email address and we need to have exactly the firstname and lastname
 * specified in caporal argument
 * 
 * @param {String} firstName 
 * @param {String} lastName 
 * @param {String} emailAddr 
 * @return {Boolean}
 */
const testName = (firstName, lastName, emailAddr) => {
    const [
        firstNameUpper,
        lastNameUpper,
        emailAddrUpper
    ] = [firstName, lastName, emailAddr].map(x => x.toUpperCase());

    return emailAddrUpper.includes(firstNameUpper)
        && emailAddrUpper.includes(lastNameUpper);
};

/**
 * 
 * check if employee's name (parsed from caporal argument) is included
 * in an email's address.
 * 
 * the employee's name must be separated by one or more spaces
 * e.g. 'cheng jiang', 'cheng        jiang' are valid
 * 
 * however
 *  'cheng', 'jiang' are not valid, maybe later I can add support for this
 * 
 * if it's included in sender, then this function returns 'exchanged.SENT'
 * if it's included in some receiver's email address, then this function returns 'exchanged.RECEIVED'
 * otherwise, this function returns 'exchanged.NONE'
 * 
 * @param {Email} email 
 * @param {Caporal.arguments} args 
 * @return {exchanged | Error}
 */
const checkEmployeeName = (email, args) => {
    const { employee } = args;
    const { sender, receivers } = email;

    const re = /^(\w+)(?: +)(\w+)$/;
    const matches = employee.match(re);


    if (!isNull(matches)) {
        const [
            firstName,
            lastName
        ] = matches.slice(1);

        if (testName(firstName, lastName, sender)) 
            return exchanged.SENT;
        else if (isArrayAndHasLength(receivers) && receivers.some(r => testName(firstName, lastName, r))) 
            return exchanged.RECEIVED;
        else 
            return exchanged.NONE;
    } else {

        return new Error(ErrMsg.OPTION_INVALID_FORMAT(arguments.employee.var));
    }
};

const action = (args, options, logger) => {
    // start the spinner
    const spinner = ora(InfoMsg.Loading).start();

    const tb = new Table([
        'Rank',
        'Days',
        'Sent Emails'
    ]);


    FileWalker(args.dir, (err, absPath, data) => {

        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);        

        const email = emailParser.parseAndCreateEmail();
        
        const rsDate = (checkDateInRange(email, options) && outsideWorkingHours(email));               

        const rsEmployee = checkEmployeeName(email, args);        
        

        if (rsDate instanceof Error) 

            spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if (rsEmployee instanceof Error)
        
            spinner.stop(), logger.error(chalk.red(rsEmployee.message)), process.exit(1);

        else if (rsDate) {
            if(rsEmployee === exchanged.SENT)
            {
                let daysAlreadyImputed = false;
                let indexImputed;
                for(let i = 0; i < buzzyDaysArrays.length;i++)
                {
                    if(buzzyDaysArrays[i][0] === getTodaysDate(email))
                    {
                        daysAlreadyImputed = true;
                        indexImputed = i;
                        break;
                    }
                }
                if(daysAlreadyImputed)
                {
                    buzzyDaysArrays[indexImputed][1]++;
                }
                else
                {
                    buzzyDaysArrays.push([getTodaysDate(email),1]);
                }
                

            }
        }
    }, () => {
        spinner.stop();

        buzzyDaysArrays.sort(sortDescending);
        let i = 0;
        while(i < buzzyDaysArrays.length && i < 10)
        {
            tb.push([
                (i+1).toString(),
                buzzyDaysArrays[i][0].toString(),
                buzzyDaysArrays[i][1].toString()
                        ]);
            i++;
        }


        process.stdout.write(tb.toString());
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