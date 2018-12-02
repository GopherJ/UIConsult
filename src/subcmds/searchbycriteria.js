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

const Z = [];

const { 
    isInRange, 
    isNull, 
    isUndefined,
    lastDayOfMonth, 
    isNumber
} = require('../utils');


const alias = 'sbc';

const command = {
    name: 'SearchByCriteria',
    description: 'Load emails of specific period'
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
    noe: {
        var: '-e, --wen',
        description: 'user name or adresse',
        type: cli.STRING
    },
    param: {
        var: '-e, --param',
        description: 'user name or adresse',
        type: cli.STRING
    }
};


const parseDate = (dateStr, isDateFrom) => {
    const re = /^(?:([0-9]{1,2})\/)?(?:([0-9]{1,2})\/)?(?:([0-9]{4}))$/;
    const matches = dateStr.match(re);
    const VAR = isDateFrom ? options.dateFrom.var : options.dateTo.var;

    if (!isNull(matches)) {
        const [
            d,
            m,
            y
        ] = matches.slice(1).map(x => +x);

        if (!isNumber(m) && !isNumber(d)) {
            return new Date(y, 0);
        } else if (!isNumber(m)) {
            if (!isInRange([1, 12], d)) {
                return new Error(ErrMsg.OPTION_OUT_OF_RANGE(VAR));
            } else {
                return new Date(y, d - 1, 0);
            }
        } else {
            if (!isInRange([1, lastDayOfMonth(m, y)], d) || !isInRange([1, 12], m)) {
                return new Error(ErrMsg.OPTION_OUT_OF_RANGE(VAR));
            } else {
                return new Date(y, m - 1, d);
            }
        }
    } else {
        return new Error(ErrMsg.OPTION_INVALID_FORMAT(VAR));
    }
};


  
const checkDateInRange = (email, options) => {
    const { dateFrom, dateTo } = options;
    const { date } = email;

    if (isUndefined(dateFrom) && isUndefined(dateTo)) {
        return true;
    } else if (isUndefined(dateTo)) {
        const rs = parseDate(dateFrom, true);

        if (rs instanceof Error) return rs;
        if(rs > date) return false;
        return true;
    } else if (isUndefined(dateFrom)) {
        const rs = parseDate(dateTo, false);

        if (rs instanceof Error) return rs;
        if(rs < date) return false;
        return true;
    }

    const rsFrom = parseDate(dateFrom, true);
    const rsTo = parseDate(dateTo, false);

    if (rsFrom instanceof Error) return rsFrom;
    if (rsTo instanceof Error) return rsTo
    if (rsFrom > date || rsTo < date) return false;
    return true;
};

function matchRecievers(a, b, c){
if(c ==! null){
    for(var i in a){
        if(a[i].match(new RegExp(b, "i")) && a[i].match(new RegExp(c, "i")))
        return true;
        else return false;
    }
}else{
    for(var i in a){
        if(a[i].match(new RegExp(b, "i")))
        return true;
        else return false;
    }
}
}

const action = (args, options, logger) => {
    const emailList = new EmailList();
    const spinner = ora(InfoMsg.Loading).start();

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();
        
        const rs = checkDateInRange(email, options);
        if (rs instanceof Error) spinner.stop(), logger.error(chalk.red(rs.message)), process.exit(1);
        else if (rs) Z.push(email);
    
    }, () => {
        
        var tmp = [];
        var sender = '';
        var recievers = [];
        var content = '';
        

        if(options.wen ==="e"){

            for (var element in Z){
               
                sender = Z[element].sender;
                recievers = Z[element].receivers;

                if(sender === options.param || (recievers.indexOf(options.param)) != -1 ){
                tmp.push(Z[element]);
                emailList.push(Z[element]);    
            }
             }
             
             spinner.stop();
             process.stdout.write(emailList.toString());


        }else if (options.wen ==="n"){
            exp = options.param.split(' ')
            exp1 = exp[0];
            exp2 = exp[1];

            for (var element in Z){

               sender = Z[element].sender;
               recievers = Z[element].receivers;
               content = Z[element].content;

                if(sender.match(new RegExp(exp1, "i")) && sender.match(new RegExp(exp2, "i"))||matchRecievers(recievers, exp1, exp2) || content.match(new RegExp(exp1, "i")) && content.match(new RegExp(exp2, "i"))){
                    tmp.push(Z[element]);
                    emailList.push(Z[element]);    

                 }
            }  
            
            spinner.stop();
            process.stdout.write(emailList.toString());

        }else if (options.wen ==="w"){

            for (var element in Z){

            sender = Z[element].sender;
            recievers = Z[element].receivers;
            content = Z[element].content;

            if(sender.match(new RegExp(options.param, "i"))||matchRecievers(recievers, options.param, null) || content.match(new RegExp(options.param, "i"))){
                
                tmp.push(Z[element]);
                emailList.push(Z[element]);
            }
        }
        
        spinner.stop();
        process.stdout.write(emailList.toString());

    }
    }, path => {
        spinner.stop();
        logger.error(chalk.red(ErrMsg.IO_PERMISSION_DENIED(path)));
    });

}
;

module.exports = {
    alias,
    command,
    arguments,  
    options,
    action
};