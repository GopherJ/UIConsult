/**
 *  Email List
 */
const Table = require('cli-table3');
const os = require('os');
const Email = require('./Email');
const { execSync } = require('child_process');

class EmailList {
    constructor() {
        this.emails = [];
        this.cols = 80;

        switch(os.platform()) {
            case 'darwin':
            case 'linux':
                this.cols = process.stdout.columns;
                break;
            case 'win32':
                const rs = execSync('mode con | findStr Columns').toString('utf8');
                const numMatches = rs.match(/(\d+)/);
                if (numMatches !== null) this.cols = +numMatches.slice(1).pop();
                break;
        }

        this.tb = new Table({
            head: ['Subject', 'Date', 'Sender', 'Receivers', 'Content'],
            colWidths: [1/6, 1/6, 1/6, 1/6, 1/6].map(x => Math.floor(x * this.cols))
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

    length() {
        return this.emails.length;
    }
}

module.exports = EmailList;