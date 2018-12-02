/**
 *  util functions
 * 
 *  @author Cheng
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
const formatDateHour = d => dayjs(d).format('YYYY-MM-DD HH:mm:ss');
const formatDate = d => dayjs(d).format('YYYY-MM-DD');
const formatHour = d => dayjs(d).format('HH:mm:ss');
const makeArray = (s, i) => new Array(s).fill(i);
const descending = (a, b) => b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
const descendingByProp = p => ((a, b) => b[p] < a[p] ? -1 : b[p] > a[p] ? 1 : b[p] >= a[p] ? 0 : NaN);
const descendingByIdx = p => ((a, b) => b[p] < a[p] ? -1 : b[p] > a[p] ? 1 : b[p] >= a[p] ? 0 : NaN);
const isOutsideWorkingHours = d => !(isDate(d) && d.getHours() > 8 && d.getHours() < 22);
const isTheSameStrIgnoreCase = (a, b) => isString(a) && isString(b) && a.toUpperCase() === b.toUpperCase();
const uniqueWords = s => isEmptyString(s)
    ? []
    : /[a-zA-Z]{2,}/.test(s)
    ? Array.from(new Set(s.match(/[a-zA-Z]{2,}/g))).filter(w => !['re', 'fw', 'fwd'].some(x => isTheSameStrIgnoreCase(w, x)))
    : [];

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
    uniqueWords
};
