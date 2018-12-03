const {
    isArrayAndHasLength,
    isUndefined,
    isNull
} = require('./index');
const {
    exchanged
} = require('./constants');

const ErrMsg = require('../msg/ErrMsg');

/**
 * 
 * check if employee's name is included in email address
 * 
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
    ] = [firstName, lastName, emailAddr.replace(/@.*$/, '')]
    .map(x => x.toUpperCase());

    return `${firstNameUpper}.${lastNameUpper}` === emailAddrUpper;
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
const checkEmployeeName = (email, args, arguments) => {
    const { employee } = args;
    const { sender, receivers } = email;

    const re = /^\s*(?:(?:(\w+)(?:\s+)(\w+))|(?:(\w+)\.(\w+)@.+))\s*$/;
    const matches = employee.match(re);

    // e.g 'cheng jiang' 'cheng.jiang@utt.fr' '  cheng  jiang  ' ' cheng.jiang@utt.fr '
    if (!isNull(matches)) {
        const [
            firstName,
            lastName
        ] = matches.slice(1).filter(x => !isUndefined(x));

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

module.exports = checkEmployeeName;