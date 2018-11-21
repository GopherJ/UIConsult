/**
 *  Email List
 */
const table = require('cli-table3');
const os = require('os');
const { execSync } = require('child_process');
const Email = require('./Email');

class EmailList {
    constructor() {
        this.emails = [];
        this.cols = 80;

        switch(os.platform()) {
            case 'darwin':
            case 'linux':
                this.cols = process.env.COLUMNS;
                break;
            case 'win32':
                const rs = execSync('mode con | findStr columns').toString('utf8');
                const numMatches = rs.match(/(\d+)/);
                if (numMatches !== null) this.cols = +numMatches.slice(1).pop();
                break;
        }

        this.tb = new table({
            head: ['Subject', 'Date', 'Sender', 'Receivers', 'Content'],
            colWidths: [1/12, 1/12, 1/12, 1/12, 3/4].map(x => x * this.cols)
        });
    }

    push(email) {
        if (email instanceof Email) {
            this.emails.push(email);

            this.tb.push([
                email.subject,
                email.date,
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
}

module.exports = EmailList;