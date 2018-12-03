/**
 *  util functions
 *
 *  @author Cheng JIANG
 *
 */
const dayjs = require('dayjs');
const objectPath = require('object-path');
const { timeUnitMap } = require('./constants');

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
const ascending = (b, a) => b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
const descending = (a, b) => b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
const descendingByProp = p => ((a, b) => b[p] < a[p] ? -1 : b[p] > a[p] ? 1 : b[p] >= a[p] ? 0 : NaN);
const ascendingByProp = p => ((b, a) => b[p] < a[p] ? -1 : b[p] > a[p] ? 1 : b[p] >= a[p] ? 0 : NaN);
const descendingByIdx = i => ((a, b) => b[i] < a[i] ? -1 : b[i] > a[i] ? 1 : b[i] >= a[i] ? 0 : NaN);
const descendingByIdxIdx = (i1, i2) => ((a, b) => b[i1][i2] < a[i1][i2] ? -1 : b[i1][i2] > a[i1][i2] ? 1 : b[i1][i2] >= a[i1][i2] ? 0 : NaN);
const descendingByIdxProp = (i, p) => ((a, b) => b[i][p] < a[i][p] ? -1 : b[i][p] > a[i][p] ? 1 : b[i][p] >= a[i][p] ? 0 : NaN);
const isOutsideWorkingHours = d => !(isDate(d) && d.getHours() > 8 && d.getHours() < 22);
const isTheSameStrIgnoreCase = (a, b) => isString(a) && isString(b) && a.toUpperCase() === b.toUpperCase();
const words = s => isEmptyString(s)
    ? []
    : /(([a-zA-Z]{2,})|([aI]))/.test(s)
    ? s.match(/(([a-zA-Z]{2,})|([aI]))/g)
    : [];
const uniqueWords = s => isEmptyString(s)
    ? []
    : /(([a-zA-Z]{2,})|([aI]))/.test(s)
    ? Array.from(new Set(s.match(/(([a-zA-Z]{2,})|([aI]))/g))).filter(w => !['re', 'fw', 'fwd'].some(x => isTheSameStrIgnoreCase(w, x)))
    : [];
const diffOfSecs = (a, b) => !(isDate(a) && isDate(b))
    ? 0
    : Math.ceil(Math.abs(a.valueOf() - b.valueOf()) / 1000);
const convTimeUnitCombToNum = s => !(/^\s*[1-9]([hmdwMy])\s*$/.test(s))
    ? NaN
    : s.match(/^\s*([1-9])([hmdwMy])\s*$/).slice(1).reduce((ite, cur) => (+ite) * timeUnitMap[cur]);
const updateTimeUnit = (s, u) => isArrayAndHasLength(s.layer) && s.layer.forEach(l => objectPath.set(l, ['encoding', 'x', 'timeUnit'], u));
const parseEmployeeName = s => s.match(/^\s*(?:(?:([a-zA-Z0-9_-]+)(?:\s+)([a-zA-Z0-9_-]+))|(?:([a-zA-Z0-9_-]+)[\.]+([a-zA-Z0-9_-]+)@[a-zA-Z0-9_]+?\.[a-zA-Z0-9]{2,3})|([a-zA-Z0-9_-]+)|(?:([a-zA-Z0-9_-]+)@[a-zA-Z0-9_]+?\.[a-zA-Z0-9]{2,3}))\s*$/)
    .slice(1).filter(x => !isUndefined(x)).join(' ');
const parseEmailAddr = addr => isEmptyString(addr)
    ? ''
    : addr.replace(/@.*$/, '').split(/[\.]+/).join(' ');
const percent = (v, t) => `${(v / t).toFixed(4) * 100}%`;
const noop = () => {};

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
    ascending,
    ascendingByProp,
    descending,
    descendingByProp,
    descendingByIdx,
    descendingByIdxIdx,
    descendingByIdxProp,
    words,
    uniqueWords,
    diffOfSecs,
    convTimeUnitCombToNum,
    updateTimeUnit,
    parseEmployeeName,
    parseEmailAddr,
    percent,
    noop
};
