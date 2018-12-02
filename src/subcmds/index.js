const loademails = require('./loademails');
const nbemails = require('./nbemails');
const busydays = require('./busydays');
const topcontact = require('./topcontact');
const freqemailuser = require('./freqemailuser');
const nbemailscolab = require('./nbemailscolab');
const searchbycriteria = require('./searchbycriteria');
const topwords = require('./topwords');
const emailsplot = require('./emailsplot');

const subcmds = [
    searchbycriteria,
    freqemailuser,
    nbemailscolab,
    loademails,
    nbemails,
    busydays,
    topcontact,
    topwords,
    emailsplot
];

module.exports = subcmds;
