/**
 *  util functions
 * 
 */
const dayjs = require('dayjs');

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
const formatDate = d => dayjs(d).format('YYYY-MMDD HH:mm:ss');
const makeArray = (s, i) => new Array(s).fill(i);
const getHour = e =>  {
    let date = String(e.date);
    //get hour in a mail in the hh:mm format
    const re = /(?<=\s)[0-9]{2}:[0-9]{2}/;
    return date.match(re)[0];
}
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
    let affichage = str.split(',');
    for(let i = 0; i < affichage.length ;i++)
    {
        if(!isNull(affichage[i].match(test)))
        {
            affichage[i] = affichage[i].match(test)[0];
        }

    }
    return affichage;
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
    lastDayOfMonth,
    formatDate,
    makeArray,
    getHour,
    getTodaysDate,
    sortDescending,
    arrayOfReceiversName,
    senderName,
    sortDescendingTopContact
};