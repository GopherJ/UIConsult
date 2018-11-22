/**
 *  utils
 */
const dayjs = require('dayjs');

const isString = s => typeof s === 'string';
const isEmptyString = s => s === '';
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
const isInRange = (arr, n)=> isArray(arr) 
    && arr.length === 2 
    && arr.every(x => isNumber(x))
    && isNumber(n) 
    && n >= arr[0] 
    && n <= arr[1];
const lastDayOfMonth = (m, y) => new Date(y, m, 0).getDate();
const formatDate = d => dayjs(d).format('YYYY-MM-DD HH:mm:ss');

module.exports = {
    isString,
    isEmptyString,
    isNull,
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
    formatDate
};