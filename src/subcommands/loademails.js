/**
 * This is for SPEC_1
 */
import cli from 'caporal';

const command = {
    name: 'loademails',
    description: 'Load all emails in specific period'
};

const argument = {
    var: '<>',
    description: ''
};

const options = [
    {
        var: '',
        description: '',
        type: '',
        default: ''
    }
];

const action = (args, options, logger) => {

};

export default {
   command,
   argument,
   options,
   action
};

