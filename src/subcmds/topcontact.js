/**
 * @author Cherchour Liece
 * Spec 4
 */
const chalk = require('chalk');
const ora = require('ora');

const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const Table = require('../lib/Table');

const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');


const { 
    isNull, 
    isArrayAndHasLength,
    arrayOfReceiversName,
    senderName,
    sortDescendingTopContact
} = require('../utils');

/**
 * state for describing that it's an email sent or received by an employee
 */
const exchanged = {
    SENT: Symbol(),
    RECEIVED: Symbol(),
    NONE: Symbol()
};

const alias = 'top';

const command = {
    name: 'topcontact',
    description: "Show an employee's exchanged emails' statistics of specific period"
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
};

let topContact = [];

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
    console.log(topContact.length)

    let trouver = false;
    let pos = -1;
    let i = 0;

    // create table, detect terminal's width and use the width and table head
    // to init a correct table
    const tb = new Table([
        'Rank',
        'Employee Name',
        'Sent Emails',
        'Received Emails',
        'Total of exchanged Emails'
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

        // error
        if (rsEmployee instanceof Error) 
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsEmployee.message)), process.exit(1);
        // no error
        else {
            switch(rsEmployee) {
            case exchanged.SENT : 
            let names = arrayOfReceiversName(email);
            trouver = false;
            pos = -1;
            i = 0;
            names.forEach(element => {
                trouver = false;
                pos = -1;
                i = 0;
                while( i < topContact.length && !trouver)
                {
                    if(element === topContact[i][0])
                    {
                        pos = i;
                        trouver = true;
                    }
                    i++;
                }
                if(pos === -1)
                {
                    let arrayPush = [element,1,0,1];
                    topContact.push(arrayPush);
                    
                }
                else
                {
                    topContact[pos][1]++;
                    topContact[pos][3]++;
                }
                
            });
                break;
            case exchanged.RECEIVED:
                let name = senderName(email);
                trouver = false;
                pos = -1;
                i = 0;
                while( i < topContact.length && !trouver)
                {
                    if(name === topContact[i][0])
                    {
                        pos = i;
                        trouver = true;
                    }
                    i++;
                }
                if(pos === -1)
                {
                    let arrayPush = [name,0,1,1];
                    topContact.push(arrayPush);

                }
                else
                {
                    topContact[pos][2]++;
                    topContact[pos][3]++;
                }
                break;
            default:
                break;
            }
        }
    }, () => {
        // file walker endsenderNames correctly
        // stop spinner
        spinner.stop();

        // add a table row, every item must be string otherwise if fails to add
        // more info => Table.js
        topContact.sort(sortDescendingTopContact);
        let i = 0;
    while(topContact.length >i && i < 10)
    {
        tb.push([
            (i+1).toString(),
            topContact[i][0],
            topContact[i][1].toString(),
            topContact[i][2].toString(),
            topContact[i][3].toString()
        ]);
        i++;
    }


        // print table
        process.stdout.write(tb.toString());
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