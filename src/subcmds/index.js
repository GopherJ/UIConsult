const loademails = require('./loademails');
const nbemails = require('./nbemails');
const buzzydays = require('./buzzydays');
const topcontact = require('./topcontact');
const freqemailuser = require('./freqemailuser');
const nbemailsColab = require('./nbemailsColab');
const SearchByCriteria = require('./SearchByCriteria');


const subcmds = [
    SearchByCriteria,
    freqemailuser,
    nbemailsColab,
    loademails,
    nbemails,
    buzzydays,
    topcontact

];

module.exports = subcmds;
