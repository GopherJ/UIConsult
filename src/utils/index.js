exports.isString = s => typeof s === 'string';
exports.isEmptyString = s => s === '';
exports.isArray = arr => Array.isArray(arr);
exports.isArrayAndHasLength = arr => Array.isArray && arr.length > 0;
exports.isFunction = f => typeof f === 'function';
exports.isAllFuntion = arr => isArray(arr) && arr.every(f => isFunction(f));
