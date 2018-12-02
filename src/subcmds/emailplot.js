/**
 * @author Cherchour Liece
 * Spec 6 
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const vg = require('vega');
const vegalite = require('vega-lite');
const fs = require('fs');

const OpenSVG = require('../lib/OpenSVG');
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

const alias = 'emp';

const command = {
    name: 'emailplot',
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
    }
};
var emailPlot = {
    "width": 560,
    "data": {"values":[]},
    "layer": [
        {
          "mark": "point",
          "encoding": {
            "x": {
              "title": "",
              "timeUnit": "yearmonthdate",
              "field": "date",
              "type": "temporal"
            },
            "y": {
              "title": "",
              "field": "receivedEmail",
              "type": "quantitative"
            },
            "size": {
              "value": 50
            },
            "color": {
              "value": "green"
            }
          }
        },
        {
          "mark": "point",
          "encoding": {
            "y": {
              "title": "",
              "field": "sentEmail",
              "type": "quantitative"
            },
            "size": {
              "value": 50
            },
            "color": {
              "value": "blue"
            }
          }
        }
      ]
  };
let mailFrequency = [];
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

        // e.g. '2018'
        if (!isNumber(m) && !isNumber(d)) {
            return new Date(y, 0);
        // e.g '01/2018'
        } else if (!isNumber(m)) {
            // e.g. '13/2018'
            if (!isInRange([1, 12], d)) {
                return new Error(ErrMsg.OPTION_OUT_OF_RANGE(VAR));
            } else {
            // e.g. '12/2018'
                return new Date(y, d - 1, 0);
            }
        // e.g. '1/1/2018'
        } else {
            // e.g. '34/1/2018', '1/34/2018'
            if (!isInRange([1, lastDayOfMonth(m, y)], d) || !isInRange([1, 12], m)) {
                return new Error(ErrMsg.OPTION_OUT_OF_RANGE(VAR));
            } else {
                // e.g '1/1/2018'
                return new Date(y, m - 1, d);
            }
        }
    } else {
        // e.g. 'asdj'
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
    // date strings in options 
    const { dateFrom, dateTo } = options;
    const { date } = email;

    // no range specified
    if (isUndefined(dateFrom) && isUndefined(dateTo)) {
        return true;
    // end date is specified
    } else if (isUndefined(dateTo)) {
        const rs = parseDate(dateFrom, true);

        // parsing error
        if (rs instanceof Error) return rs;
        // email's date is out of range
        if(rs > date) return false;
        return true;
    // start date is specified
    } else if (isUndefined(dateFrom)) {
        const rs = parseDate(dateTo, false);

        // parsing error
        if (rs instanceof Error) return rs;
        // email's date is out of range
        if(rs < date) return false;
        return true;
    }

    // start date and end date are all specified
    const rsFrom = parseDate(dateFrom, true);
    const rsTo = parseDate(dateTo, false);

    // parsing date error
    if (rsFrom instanceof Error) return rsFrom;
    if (rsTo instanceof Error) return rsTo

    // email's date is out of range
    if (rsFrom > date || rsTo < date) return false;
    return true;
};

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

    // e.g 'cheng jiang'
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
        // e.g. 'slkdjlsd'
        return new Error(ErrMsg.OPTION_INVALID_FORMAT(arguments.employee.var));
    }
};

const action = (args, options, logger) => {
    // start the spinner
    const spinner = ora(InfoMsg.Loading).start();

    // create table, detect terminal's width and use the width and table head
    // to init a correct table
    const tb = new Table([
        'Rank',
        'Days',
        'Sent Emails'
    ]);

    // start to read file recursively
    FileWalker(args.dir, (err, absPath, data) => {
        // failed to read a file
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        // email parser instance
        const emailParser = new EmailParser(data);        
        // parse email and return an Email instance
        const email = emailParser.parseAndCreateEmail();
        
        // check employee's name, if there is an error then bubble up
        const rsEmployee = checkEmployeeName(email, args);        
        
        const rsDate = (checkDateInRange(email, options));
        // error
        if (rsDate instanceof Error) 
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if (rsEmployee instanceof Error) 
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsEmployee.message)), process.exit(1);
        // no error
        else if(rsDate)
        {
            if(rsEmployee === exchanged.SENT){
                let daysAlreadyImputed = false;
                let indexImputed;
                for(let i = 0; i < mailFrequency.length;i++)
                {
                    if(Date.parse(mailFrequency[i].date) === Date.parse(getTodaysDate(email)))
                    {
                        daysAlreadyImputed = true;
                        indexImputed = i;
                        break;
                    }
                }
                if(daysAlreadyImputed)
                {
                    mailFrequency[indexImputed].sentEmail++;
                }
                else
                {
                    let toInput = {
                        "date": (getTodaysDate(email)),
                        "sentEmail" : 1,
                        "receivedEmail" : 0
                    };
                    mailFrequency.push(toInput);  
                }
        }
        else if(rsEmployee === exchanged.RECEIVED){
            let daysAlreadyImputed = false;
            let indexImputed;
            for(let i = 0; i < mailFrequency.length;i++)
            {
                if(Date.parse(mailFrequency[i].date) === Date.parse(getTodaysDate(email)))
                {
                    daysAlreadyImputed = true;
                    indexImputed = i;
                    break;
                }
            }
            if(daysAlreadyImputed)
            {
                mailFrequency[indexImputed].receivedEmail++;
            }
            else
            {
                let toInput = {
                    "date": (getTodaysDate(email)),
                    "sentEmail" : 0,
                    "receivedEmail" : 1
                };
                mailFrequency.push(toInput);  
            }
        }
}
    }, () => {
        // file walker ends correctly
        // stop spinner
        spinner.stop();
        //console.log(mailFrequency)
        //Svg
        emailPlot['data']['values'] = mailFrequency;
        Json = JSON.stringify(emailPlot);      
        
        const myChart = vegalite.compile(emailPlot, {config: {background: "white"}}).spec;

        /* SVG version */        
        var runtime = vg.parse(myChart);
        var view = new vg.View(runtime).renderer('svg').run();
        var mySvg = view.toSVG();
        mySvg.then(function(res){
            fs.writeFileSync("./result.svg", res)
            view.finalize();
            OpenSVG('./result.svg')
        });
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