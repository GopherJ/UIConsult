import cli from 'caporal';
import subcommands from './subcommands';

cli
    .version('0.1.0');

subcommands.forEach(subcommand => {
    const command = cli
        .command(subcommand.command.name, subcommand.command.description);

    if (subcommand.alias) {
        command.alias(subcommand.alias);
    }

    if (subcommand.argument) {
        command.argument(subcommand.argument, subcommand.argument.description);
    }

    if (subcommand.options && subcommand.options.length > 0) {
        subcommand.options.forEach(option => {
            command.option(option.var, option.description, option.type, option.default);
        });
    }

    command.action(subcommand.action);
});

cli.parse(process.argv);

