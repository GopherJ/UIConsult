const cli = require('caporal');
const subcmds = require('./subcmds');

const {
    isArrayAndHasLength,
    isString
} = require('./utils')

cli
    .version('0.1.0');

subcmds.forEach(subcmd => {
    const { 
        command, 
        alias, 
        arguments, 
        options, 
        action 
    } = subcmd;

    const valuesArg = Object.values(arguments);
    const valuesOpt = Object.values(options);

    const cmd = cli.command(command.name, command.description);

    if (isString(alias)) cmd.alias(alias);
    if(isArrayAndHasLength(valuesArg))
        valuesArg.forEach(arg => cmd.argument(arg.var, arg.description));
    if (isArrayAndHasLength(valuesOpt)) 
        valuesOpt.forEach(opt => cmd.opt(opt.var, opt.description, opt.type, opt.default));

    cmd.action(action);
});

cli.parse(process.argv);

