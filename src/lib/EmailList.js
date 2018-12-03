/*
 * Email list
 *
 * @Author: Cheng JIANG 
 * @Date: 2018-11-27 22:33:47 
 * @Last Modified by: Cheng JIANG
 * @Last Modified time: 2018-12-02 15:15:42
 */

const Email = require('./Email');
const Table = require('./Table');

const { formatDateHour } = require('../utils');

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
                formatDateHour(email.date),
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