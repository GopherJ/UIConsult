const cli = require('caporal');
const subcmds = require('./subcmds');
const { isArrayAndHasLength } = require('./utils')

cli
    .version('0.1.0');

subcmds.forEach(subcmd => {
    const { 
        command, 
        alias, 
        argument, 
        options, 
        action 
    } = subcmd;

    const cmd = cli.command(command.name, command.description);

    if (alias) cmd.alias(alias);
    if (argument) cmd.argument(argument.var, argument.description);
    if (isArrayAndHasLength(options)) options.forEach(option => {
        cmd.option(option.var, option.description, option.type, option.default);
    });

    cmd.action(action);
});

cli.parse(process.argv);

