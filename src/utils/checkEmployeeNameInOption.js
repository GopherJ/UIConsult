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
    ] = emailAddr.replace(/@.*$/, '').split(/[\.]+/).map(x => x.toUpperCase());

    return firstName.toUpperCase() === firstNameUpper
        && lastName.toUpperCase() === lastNameUpper;
};

/**
 *
 * check if employee's name is included in email address
 *
 * specified in caporal argument
 *
 * @param {String} fullname
 * @param {String} emailAddr
 * @return {Boolean}
 */
const testFullName = (fullname, emailAddr) => {
    const [
        fullnameUpper,
        emailAddrUpper
    ] = [fullname, emailAddr.replace(/@.*$/, '')]
    .map(x => x.toUpperCase());

    return fullnameUpper === emailAddrUpper;
}

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
 * @param {Caporal.arguments} opts
 * @return {exchanged | Error}
 */
const checkEmployeeNameInOption = (email, opts, options) => {
    const { employee } = opts;
    const { sender, receivers } = email;
    const { SENT, RECEIVED, NONE } = exchanged;

    const re = /^\s*(?:(?:([a-zA-Z0-9_-]+)(?:\s+)([a-zA-Z0-9_-]+))|(?:([a-zA-Z0-9_-]+)[\.]+([a-zA-Z0-9_-]+)@[a-zA-Z0-9_]+?\.[a-zA-Z0-9]{2,3})|([a-zA-Z0-9_-]+)|(?:([a-zA-Z0-9_-]+)@[a-zA-Z0-9_]+?\.[a-zA-Z0-9]{2,3}))\s*$/;
    const matches = employee.match(re);

    // e.g 'cheng jiang' 'cheng.jiang@utt.fr' '  cheng  jiang  ' ' cheng.jiang@utt.fr '
    // 'cheng@utt.fr' 'cheng' '    cheng'  '    cheng    '   'cheng    '
    if (!isNull(matches)) {
        const groups = matches.slice(1).filter(x => !isUndefined(x));

        switch(groups.length) {
        case 1:
            const [fullname] = groups;
            if (testFullName(fullname, sender))
                return SENT;
            else if (isArrayAndHasLength(receivers) && receivers.some(r => testFullName(fullname, r)))
                return RECEIVED;
            else
                return NONE;
        case 2:
            const [
                firstName,
                lastName
            ] = groups;

            if (testName(firstName, lastName, sender))
                return SENT;
            else if (isArrayAndHasLength(receivers) && receivers.some(r => testName(firstName, lastName, r)))
                return RECEIVED;
            else
                return NONE;
        }
    } else {
        return new Error(ErrMsg.OPTION_INVALID_FORMAT(options.employee.var));
    }
};

module.exports = checkEmployeeNameInOption;
