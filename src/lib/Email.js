/**
 * Single Email
 */
class Email {
    constructor(id, sender, receivers, ccreceivers, bccreceivers, subject, date, content) {
        this.id = id;
        this.sender = sender;
        this.receivers = receivers;
        this.ccreceivers = ccreceivers;
        this.bccreceivers = bccreceivers;
        this.subject = subject;
        this.date = date;
        this.content = content;
    }
}

module.exports = Email;
