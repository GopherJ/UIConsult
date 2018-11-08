import program from 'commander';

program
    .version('0.1.0', '-v, --version')
    .option('--from', 'Specify the start date')
    .option('--to', 'Specify the end date')
    .parse(process.argv);
