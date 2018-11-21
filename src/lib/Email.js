/**
 * Single Email
 */
const table = require('cli-table3');

class Email {
    constructor(sender, receivers, ccreceivers, bccreceivers, subject, date, content) {
        this.sender = sender;
        this.receivers = receivers;
        this.ccreceivers = ccreceivers;
        this.bccreceivers = bccreceivers;
        this.subject = subject;
        this.date = date;
        this.content = content;
    }

    toString() {
        const tb = new table({
            head: ['Subject', 'Date', 'Sender', 'Receivers', 'Content'],
            colWidths: [25, 25, 25, 25, 200]
        });

        tb.push([
            this.subject,
            this.date,
            this.sender,
            this.receivers.join('\n'),
            this.content
        ]);

        return tb.toString();
    }
}

module.exports = Email;
