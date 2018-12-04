/**
 * SPEC_10
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const EmailList = require('../lib/EmailList');
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');
const checkDateRange = require('../utils/checkDateRange');
const checkEmployeeNameInOption = require('../utils/checkEmployeeNameInOption');
const checkSubjectAndContent = require('../utils/checkSubjectAndContent');

const {
    isUndefined
} = require('../utils');
const {
    exchanged
} = require('../utils/constants');

const alias = 'sbc';

const command = {
    name: 'searchbycriteria',
    description: 'Email research per criteria'
};

const arguments = [
    {
        var: '<dir>',
        description: 'Directory where store emails'
    }
];

const options = {
    dateFrom: {
        var: '-s, --date-from',
        description: 'Start date',
        type: cli.STRING
    },
    dateTo: {
        var: '-e, --date-to',
        description: 'End date',
        type: cli.STRING
    },
    employee: {
        var: '--employee',
        description: "search for emails by employee's name",
        type: cli.STRING
    },
    content: {
        var: '--content',
        description: "search for emails by content",
        type: cli.STRING
    },
    subject: {
        var: '--subject',
        description: "search for emails by subject",
        type: cli.STRING
    }
};

const action = (args, opts, logger) => {
    const spinner = ora(InfoMsg.Loading).start();
    const emailList = new EmailList();

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();

        const rsDate = checkDateRange(email, opts, options);
        if (rsDate instanceof Error) spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        else if (!isUndefined(opts.name)) {
            const rsName = checkEmployeeNameInOption(email, opts, options);
            if (rsName instanceof Error) spinner.stop(), logger.error(chalk.red(rsName.message)), process.exit(1)
            else if ((rsName === exchanged.SENT || rsName == exchanged.RECEIVED) && checkSubjectAndContent(email, opts))
                emailList.push(email);
        } else if(checkSubjectAndContent(email, opts))
            emailList.push(email);
    }, () => {
        spinner.stop();
        process.stdout.write(emailList.toString());
    }, path => {
        spinner.stop();
        logger.error(chalk.red(ErrMsg.IO_PERMISSION_DENIED(path)));
    });

};

module.exports = {
    alias,
    command,
    arguments,
    options,
    action
};
