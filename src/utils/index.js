exports.isString = s => typeof s === 'string';
exports.isEmptyString = s => s === '';
exports.isArrayAndHasLength = arr => Array.isArray && arr.length > 0;
