/**
 *  util functions
 * 
 */
const dayjs = require('dayjs');

/**
 * @author Cheng
 */
const isString = s => typeof s === 'string';
const isEmptyString = s => isString(s) && s === '';
const isNull = n => n === null;
const isUndefined = n => n === undefined;
const isArray = arr => Array.isArray(arr);
const isBoolean = b => typeof b === 'boolean';
const isDate = d => Object.prototype.toString.call(d) === '[object Date]' && !isNaN(d.getTime());
const isObject = o => Object.prototype.toString.call(o) === '[object Object]';
const isNumber = n => typeof n === 'number' && !isNaN(n);
const isArrayAndHasLength = arr => Array.isArray && arr.length > 0;
const isFunction = f => typeof f === 'function';
const isAllFuntion = arr => isArray(arr) && arr.every(f => isFunction(f));
const isAll = (arr, det) => isArrayAndHasLength(arr) && isFunction(det) && arr.every(x => det(x));
const isInRange = (arr, n)=> isArray(arr) 
    && arr.length === 2 
    && arr.every(x => isNumber(x))
    && isNumber(n) 
    && n >= arr[0] 
    && n <= arr[1];
const lastDayOfMonth = (m, y) => new Date(y, m, 0).getDate();
const formatDateHour = d => dayjs(d).format('YYYY-MM-DD HH:mm:ss');
const formatDate = d => dayjs(d).format('YYYY-MM-DD');
const formatHour = d => dayjs(d).format('HH:mm:ss');
const makeArray = (s, i) => new Array(s).fill(i);
const descending = (a, b) => b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
const descendingByProp = p => ((a, b) => b[p] < a[p] ? -1 : b[p] > a[p] ? 1 : b[p] >= a[p] ? 0 : NaN);
const descendingByIdx = p => ((a, b) => b[p] < a[p] ? -1 : b[p] > a[p] ? 1 : b[p] >= a[p] ? 0 : NaN);
const isOutsideWorkingHours = d => !(isDate(d) && d.getHours() > 8 && d.getHours() < 22);

/**
 * @author Liece 
 */
const getTodaysDate = e =>
{
    let date = String(e.date);
    let re = /[\w]{3}\s[\w]{3}\s[0-9]{2}\s[0-9]{4}/;
    return date.match(re)[0];
    
}
const sortDescending = (a,b) => {

        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] > b[1]) ? -1 : 1;
        }
}

const arrayOfReceiversName = e => { 
    let test = /^.*(?=(\@))/;
    let str = e.receivers.toString();
    let display = str.split(',');
    for(let i = 0; i < display.length ;i++)
    {
        if(!isNull(display[i].match(test)))
        {
            display[i] = display[i].match(test)[0];
        }

    }
    return display;
}

const senderName = e => {
    let test = /^.*(?=(\@))/;
    return e.sender.match(test)[0];    
}

const sortDescendingTopContact =(a,b) =>
{
    if (a[3] === b[3]) {
        return 0;
    }
    else {
        return (a[3] > b[3]) ? -1 : 1;
    }
}
const ArrayOfUniqueWords= s => {
    var emailStarter = ["re","fw","fwd"];
    let reg = /((\b[^\s]+\b))/g;
    if(s.match(reg)!==null) {
    let words = s.match(reg).slice(1);
    let lowerCaseWords = words.map(v => v.toLowerCase());
    let lowerCaseUniqueWords = lowerCaseWords.filter(function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    })
    for (let index = 0; index < emailStarter.length; index++) {
        var indexWords = lowerCaseUniqueWords.indexOf(emailStarter[index])
        if(indexWords !== -1)
        {
            lowerCaseUniqueWords.splice(indexWords,1);
        }
        
    }
    return lowerCaseUniqueWords;
}
    return "";
}

module.exports = {
    isString,
    isEmptyString,
    isNull,
    isAll,
    isBoolean,
    isUndefined,
    isDate,
    isObject,
    isNumber,
    isArrayAndHasLength,
    isFunction,
    isAllFuntion,
    isInRange,
    isOutsideWorkingHours,
    lastDayOfMonth,
    formatDateHour,
    formatDate,
    formatHour,
    makeArray,
    descending,
    descendingByProp,
    descendingByIdx,

    getTodaysDate,
    sortDescending,
    arrayOfReceiversName,
    senderName,
    sortDescendingTopContact,
    ArrayOfUniqueWords,
};
