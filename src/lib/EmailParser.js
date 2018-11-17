import Email from './Email';


/**
 * Email Parser
 */
class EmailParser {
    constructor(mailText) {
        this._isMigrated = false;
        this._mailText = mailText;
    }

    parseId() {
        const re = /^Message-ID: ?<(.*)>/;
        this._id = this._mailText.match(re)[1];

        return this;
    }

    parseDate() {
        const monthsMap = {
            'Jan': 1,
            'Feb': 2,
            'Mar': 3,
            'Apr': 4,
            'May': 5,
            'Jun': 6,
            'Jul': 7,
            'Aug': 8,
            'Sept': 9,
            'Oct': 10,
            'Nov': 11,
            'Dec': 12
        };

        const re = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), ([1-31]) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec) ([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;
        let [
            _,
            d,
            m,
            y,
            hh,
            mm,
            ss
        ] = this._mailText.match(re).slice(1);

        d = +d, m = +(monthsMap[m]) - 1, y = +y;
        hh = +hh + 8, mm = +mm, ss = +ss;

        this._date = new Date(y, m, d, hh, mm, ss);

        return this;
    }

    parseSubject() {
        const re = /^Subject: ?(.*)/;
        this._subject = this._mailText.match(re)[1];

        return this;
    }

    parseContent() {
        const re = /[\s\S]*\n\n([\s\S]*)/;
        this._content = this._mailText.match(re)[1];

        return this;
    }

    parseSender() {
        const re = /^From: ?(.*)/;
        this._sender = this._mailText.match(re)[1];

        return this;
    }

    parseReceivers() {
        const re = /^To: ?(.*)/;
        const matches = this._mailText.match(re);
        const hasReceivers = matches !== null;

        if (!hasReceivers) {
            this._isMigrated = true;
        } else {
            this._receivers = matches[1].split(', ');
        }

        return this;
    }

    parseCcReceivers() {
        const re = /^Cc: ?(.*)/;
        const matches = this._mailText.match(re);
        const hasCcReceivers = matches !== null;

        if (!hasCcReceivers) {
            this._ccreceivers = [];
        } else {
            this._ccreceivers = matches[1].split(', ');
        }

        return this;
    }

    parseBccReceivers() {
        const re = /^Cc: ?(.*)/;
        const matches = this._mailText.match(re);
        const hasBccReceivers = matches !== null;

        if (!hasBccReceivers) {
            this._bccreceivers = [];
        } else {
            this._bccreceivers = matches[1].split(', ');
        }

        return this;
    }

    parseAndCreateEmail() {
        this.parseId()
            .parseDate()
            .parseSender()
            .parseReceivers()
            .parseSubject()
            .parseContent()
            .parseCcReceivers()
            .parseBccReceivers();

        this._parsedEmail = new Email(
            this._sender,
            this._receivers,
            this._ccreceivers,
            this._bccreceivers,
            this._subject,
            this._date,
            this._content
        );

        return this._parsedEmail;
    }
}

export default EmailParser;
