const loademails = require('./loademails');
const nbemails = require('./nbemails');
const buzzydays = require('./buzzydays');
const topcontact = require('./topcontact');
const topwords = require('./topwords');
const emailplot = require('./emailplot');
const freqemailuser = require('./freqemailuser');
const nbemailsColab = require('./nbemailsColab');


const subcmds = [
    freqemailuser,
    nbemailsColab,
    loademails,
    nbemails,
    buzzydays,
    topcontact,
    topwords,
    emailplot
];

module.exports = subcmds;
