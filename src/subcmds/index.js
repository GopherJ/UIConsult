const loademails = require('./loademails');
const nbemails = require('./nbemails');
const buzzydays = require('./buzzydays');
const topcontact = require('./topcontact');
const freqemailuser = require('./freqemailuser');
const nbemailsColab = require('./nbemailsColab');
const topwords = require('./topwords');


const subcmds = [
    freqemailuser,
    nbemailsColab,
    loademails,
    nbemails,
    buzzydays,
    topcontact,
    topwords
];

module.exports = subcmds;
