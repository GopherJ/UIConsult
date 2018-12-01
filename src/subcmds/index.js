const loademails = require('./loademails');
const nbemails = require('./nbemails');
const buzzydays = require('./buzzydays');
const topcontact = require('./topcontact');
const freqemailuser = require('./freqemailuser');
const nbemailsColab = require('./nbemailsColab');
const topwords = require('./topwords');
const emailplot = require('./emailplot');


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
