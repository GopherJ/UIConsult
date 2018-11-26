/**
 *  Email List
 */
const Email = require('./Email');
const Table = require('./Table');

const { formatDate } = require('../utils');

class EmailList {
    constructor() {
        this.emails = [];

        this.tb = new Table([
            'Subject', 
            'Date', 
            'Sender', 
            'Receivers', 
            'Content'
        ]);
    }

    push(email) {
        if (email instanceof Email) {
            this.emails.push(email);

            this.tb.push([
                email.subject,
                formatDate(email.date),
                email.sender,
                email.receivers.join('\n'),
                email.content
            ]);
        }

        return this;
    }

    toString() {
        return this.tb.toString(); 
    }

    length() {
        return this.emails.length;
    }
}

module.exports = EmailList;