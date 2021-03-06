/**
 * SPEC_5
 *
 * @author Cherchour Liece
 *
 * Edit: Cheng JIANG
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');
const Table = require('../lib/Table');
const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');
const checkDateRange = require('../utils/checkDateRange');
const checkEmployeeName = require('../utils/checkEmployeeName');

const {
    noop,
    words,
    percent,
    UpperFirstChar,
    descendingByIdxProp,
} = require('../utils');

const {
    exchanged
} = require('../utils/constants');

const alias = 'tpw';

const command = {
    name: 'topwords',
    description: "Displays the list of the 10 most used words in the emails subjects followed with the number and percentage of mail each word appears in"
};

const arguments = {
    dir: {
        var: '<dir>',
        description: 'Directory where store emails'
    },
    employee: {
        var: '<employee>',
        description: "Employee's fullname"
    }
};

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
    }
};

const action = (args, opts, logger) => {
    // start the spinner
    const spinner = ora(InfoMsg.Loading).start();

    const wordsMap = new Map();
    const Occurence = Symbol(), Appearance = Symbol();
    let wordCount = 0;

    // create table, detect terminal's width and use the width and table head
    // to init a correct table
    const tb = new Table([
        'Rank',
        'Word',
        'Number Of Occurence',
        'Percentage Of Appearance'
    ]);

    // start to read file recursively
    FileWalker(args.dir, (err, absPath, data) => {
        // failed to read a file
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        // email parser instance
        const emailParser = new EmailParser(data);
        // parse email and return an Email instance
        const email = emailParser.parseAndCreateEmail();

        const rsDate = checkDateRange(email, opts, options);
        // check employee's name, if there is an error then bubble up
        const rsEmployee = checkEmployeeName(email, args);

        // error
        if (rsDate instanceof Error)
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsDate.message)), process.exit(1);
        // error
        else if (rsEmployee instanceof Error)
            // stop spinner, log error, exit process
            spinner.stop(), logger.error(chalk.red(rsEmployee.message)), process.exit(1);
        // no error
        else if (rsDate) {
            let lock = false;
            if(rsEmployee === exchanged.SENT) {
                // Map {word => {occurence, appearance}}
                words(email.subject).forEach(w => {
                    const word = UpperFirstChar(w);

                    !wordsMap.has(word)
                        ? wordsMap.set(word, {[Occurence]: 1, [Appearance]: 1})
                        : (wordsMap.get(word)[Appearance] += 1, !lock)
                        ? (wordsMap.get(word)[Occurence] += 1, lock = true)
                        : noop();

                    wordCount += 1;
                });
            }
        }
    }, () => {
        // file walker ends correctly
        // stop spinner
        spinner.stop();

        // add a table row, every item must be string otherwise if fails to add
        // more info => Table.js
        const wordsArray = [...wordsMap].sort(descendingByIdxProp(1, Occurence)).slice(0, 10);

        wordsArray.forEach((v, k) => {
            tb.push([
                (k+1).toString(),
                v[0],
                v[1][Occurence].toString(),
                percent(v[1][Appearance], wordCount)
            ]);
        });

        // print table
        process.stdout.write(tb.toString());
    }, path => {
        // file walker ends with an error of permission
        // it fails to read a directory
        // stop spinner
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
