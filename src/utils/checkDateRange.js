const {
    isUndefined,
    isNull,
    isNumber,
    isInRange,
    lastDayOfMonth
} = require('./index');

const ErrMsg = require('../msg/ErrMsg');

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
 * @param {Object} options
 * @return {Error|Date}
 */
const parseDate = (dateStr, isDateFrom, options) => {
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
 * @param {Caporal.options} opts
 * @param {Object} options
 * @return  {Error|Boolean}
 */
const checkDateRange = (email, opts, options) => {
    // date strings in options 
    const { dateFrom, dateTo } = opts;
    const { date } = email;

    // no range specified
    if (isUndefined(dateFrom) && isUndefined(dateTo)) {
        return true;
    // end date is specified
    } else if (isUndefined(dateTo)) {
        const rs = parseDate(dateFrom, true, options);

        // parsing error
        if (rs instanceof Error) return rs;
        // email's date is out of range
        if(rs > date) return false;
        return true;
    // start date is specified
    } else if (isUndefined(dateFrom)) {
        const rs = parseDate(dateTo, false, options);

        // parsing error
        if (rs instanceof Error) return rs;
        // email's date is out of range
        if(rs < date) return false;
        return true;
    } else {
        const rsDateTo = parseDate(dateTo, false, options);
        const rsDateFrom = parseDate(dateFrom, true, options);

        // parsing error
        if (rsDateFrom instanceof Error) return rsDateFrom;
        else if (rsDateTo instanceof Error) return rsDateTo;
        else if (rsDateFrom > rsDateTo) return new Error(ErrMsg.OPTION_FROM_TO(options.dateFrom.var, options.dateTo.var))
        else if (date < rsDateTo && date > rsDateFrom) return true;
        return false;
    }

    // start date and end date are all specified
    const rsFrom = parseDate(dateFrom, true, options);
    const rsTo = parseDate(dateTo, false, options);

    // parsing date error
    if (rsFrom instanceof Error) return rsFrom;
    if (rsTo instanceof Error) return rsTo;

    // email's date is out of range
    if (rsFrom > date || rsTo < date) return false;
    return true;
};

module.exports = checkDateRange;