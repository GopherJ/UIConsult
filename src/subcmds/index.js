const loademails = require('./loademails');
const nbemails = require('./nbemails');
const buzzydays = require('./buzzydays');
const topcontact = require('./topcontact');
const freqemailuser = require('./freqemailuser');
const nbemailsColab = require('./nbemailsColab');
const SearchByCriteria = require('./SearchByCriteria');
const topwords = require('./topwords');
const emailplot = require('./emailplot');


const subcmds = [
    SearchByCriteria,
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
