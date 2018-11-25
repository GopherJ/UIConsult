const loademails = require('./loademails');
const nbemails = require('./nbemails');
const buzzydays = require('./buzzydays');
const topcontact = require('./topcontact')

const subcmds = [
    loademails,
    nbemails,
    buzzydays,
    topcontact
];

module.exports = subcmds;
