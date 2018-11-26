/**
 * 
 * create a single email object
 * 
 * @param {String} id
 * @param {String} sender
 * @param {Array<String>} receivers
 * @param {Array<String>} ccreceivers
 * @param {Array<String>} bccreceivers
 * @param {String} subject
 * @param {Date} date
 * @param {String} content
 * @return {Email}
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
