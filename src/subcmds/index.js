const loademails = require('./loademails');
const nbemails = require('./nbemails');
const nbemailsColab = require('./nbemailsColab');
const freqemailuser = require('./freqemailuser');


const subcmds = [
    freqemailuser,
    nbemailsColab,
    loademails,
    nbemails
    
];

module.exports = subcmds;
