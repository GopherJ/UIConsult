/**
 * SPEC_8
 */
const cli = require('caporal');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');

var vg = require('vega');
var vegalite = require('vega-lite');

const OpenSVG = require('../lib/OpenSVG');
const FileWalker = require('../lib/FileWalker');
const EmailParser = require('../lib/EmailParser');

const ErrMsg = require('../msg/ErrMsg');
const InfoMsg = require('../msg/InfoMsg');

var tb = [];
const Tab = [];

const chart =   {  
        "data":{  
           "values":[  
     
           ]
        },
        "mark":"circle",
        "encoding":{  
           "size":{  
              "type":"quantitative",
              "aggregate":"sum",
              "field":"email"
           },
           "x":{  
              "type":"ordinal",
              "field":"date",
              "timeUnit":"hours"
           },
           "y":{  
              "type":"ordinal",
              "field":"date",
              "timeUnit":"day"
           }
        }
     }

const { 
    isInRange, 
    isNull, 
    isUndefined,
    lastDayOfMonth, 
    isNumber
} = require('../utils');


const alias = 'fmu';

const command = {
    name: 'freqemailuser',
    description: 'Access the frequency of a user’s sent emails on a period of time'
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
    n:{
        var: '-n, --name',
        description: 'search by user name',
        type: cli.BOOL
    },
    e:{
        var: '-email, --email',
        description: 'search by email address',
        type: cli.BOOL
    },
    param: {
        var: '-p, --param',
        description: 'user name or addresse',
        type: cli.STRING
    },
    file: {
        var: '-f, --file',
        description: 'The path where the chart will be stored(saved)',
        type: cli.STRING
    }
};

const parseDate = (dateStr, isDateFrom) => {
    const re = /^\s*(?:([0-9]{1,2})\/)?(?:([0-9]{1,2})\/)?(?:([0-9]{4}))\s*$/;
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

const monthsMap = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12
};

function resultData(array) {
    var i, j, len = array.length, out = [], obj = {};
    for (i = 0; i < len; i++) {
      obj[array[i]] = 0;
    }
    for (j in obj) {
      var abc = {date:'', email:''};
      abc.date = j;
      var accurence = myMatch(array, j);
      abc.email = accurence;
      out.push(abc);
    }
    return out;
  }
  
  function myMatch(array, word){
    var abc = 0;
    for(var i in array){
        if(array[i].match(word)){
            abc++;
        }
    }
return abc;
}

const action = (args, options, logger) => {
    const spinner = ora(InfoMsg.Loading).start();

    FileWalker(args.dir, (err, absPath, data) => {
        if (err) return logger.error(chalk.red(ErrMsg.IO_FAILED_TO_READ(absPath)));

        const emailParser = new EmailParser(data);
        const email = emailParser.parseAndCreateEmail();
        
        const rs = checkDateInRange(email, options);
        if (rs instanceof Error) spinner.stop(), logger.error(chalk.red(rs.message)), process.exit(1);
        else if (rs) Tab.push(email);
    
    }, () => {
        
        var tmp = [];
        var emaildate = 0;
        var sender = '';
        var donnees = [];
        if(options.email){

            for (var element in Tab){
               
                emaildate = Tab[element].date;
                sender = Tab[element].sender;
                if(sender === options.param)
                tmp.push(emaildate);
               
            }
              
            for(var element in tmp){
                const splt2 = (String(tmp[element]).split(' '));
                const date_1 = splt2[3]+'-'+monthsMap[splt2[1]]+'-'+splt2[2];
                const date_2 = splt2[4];
                const emailDateFinal = date_1+' '+date_2
                tb.push(emailDateFinal);
                  }
                donnees = resultData(tb);


        }else if (options.name){
            exp = options.param.split(' ')
            exp1 = exp[0];
            exp2 = exp[1];

            for (var element in Tab){
                sender = Tab[element].sender;
                emaildate = Tab[element].date;
                if(sender.match(new RegExp(exp1, "i")) && sender.match(new RegExp(exp2, "i"))){
                    tmp.push(emaildate);
                }
            }
                tmp.sort(function(a, b) {
                    return a - b;
                  });

            for(var element in tmp){
                const splt2 = (String(tmp[element]).split(' '));
                const date_1 = splt2[3]+'-'+monthsMap[splt2[1]]+'-'+splt2[2];
                const date_2 = splt2[4];
                const emailDateFinal = date_1+' '+date_2
                tb.push(emailDateFinal);
                  }
                donnees = resultData(tb);
        }
        spinner.stop();

       chart['data']['values'] = donnees;
    
       const myChart = vegalite.compile(chart, {config: {background: "white"}}).spec;

       /* SVG version */
       var runtime = vg.parse(myChart);
       var view = new vg.View(runtime).renderer('svg').run();
       var mySvg = view.toSVG();
       mySvg.then(function(res){

           const dir = path.dirname(options.file);

           fs.existsSync(dir) || fs.mkdirSync(dir);
           fs.writeFileSync(options.file, res);
           view.finalize();
           OpenSVG(options.file);

       });

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