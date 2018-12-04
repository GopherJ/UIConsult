const { isUndefined } = require('./index');

const checkSubjectAndContent = (email, opts) => {
    if (isUndefined(opts.subject) && isUndefined(opts.content))
        return true;
    else if (!isUndefined(opts.subject))
        return new RegExp(opts.subject, 'i').test(email.subject);
    else
        return new RegExp(opts.content, 'i').test(email.content);
};

module.exports = checkSubjectAndContent;
