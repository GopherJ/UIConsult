class Email {
    constructor(sender, receivers, ccreceivers, subject, date, content) {
        this.sender = sender;
        this.receivers = receivers;
        this.ccreceivers = ccreceivers;
        this.subject = subject;
        this.date = date;
        this.content = content;
    }

    get sender() {
        return this.sender;
    }

    get receivers() {
        return this.receivers;
    }

    get ccreceivers() {
        return this.ccreceivers;
    }

    get subject() {
        return this.subject;
    }

    get date() {
        return this.date;
    }

    get content() {
        return this.content;
    }
}

export default Email;
