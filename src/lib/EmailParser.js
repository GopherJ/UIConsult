import Email from './Email';

/**
 * Email Parser
 *
 * Message-ID: <8229279.1075851877390.JavaMail.evans@thyme>
 * Date: Tue, 11 Jan 2000 09:45:00 -0800 (PST)
 * From: mike.riedel@enron.com
 * To: rick.cates@enron.com, butch.russell@enron.com, leo.nichols@enron.com,
 * 	rick.loveless@enron.com, ron.harkrader@enron.com,
 * 	ron.beidelman@enron.com, larry.campbell@enron.com,
 * 	william.kendrick@enron.com
 * Subject: Team Meeting Information
 * Mime-Version: 1.0
 * Content-Type: text/plain; charset=us-ascii
 * Content-Transfer-Encoding: 7bit
 * X-From: Mike Riedel
 * X-To: Rick Cates, Butch Russell, Leo Nichols, Rick Loveless, Ron Harkrader, Ron Beidelman, Larry Campbell, William Kendrick
 * X-cc:
 * X-bcc:
 * X-Folder: \Larry_Campbell_Nov2001_1\Notes Folders\2000 goals and objectives
 * X-Origin: CAMPBELL-L
 * X-FileName: lcampbe.nsf
 *
 * Rick, please see the attached files for the teams 2000 objectives and the
 * teams response to the submittal of annual cetifications.  It also covers
 * roles and responsiblities for the entire air compliance program.
 */
class EmailParser {
    constructor(mailText) {
        this._isMigrated = false;
        this._mailText = mailText;
    }

    parseId() {
        const re = /^Message-ID: ?<(.*)>/m;
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

        // Todo: Tue, 1 Jan
        const re = /^Date: ?(Mon|Tue|Wed|Thu|Fri|Sat|Sun), ([0-9]{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec) ([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/m;
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
        const re = /^Subject: ?(.*)/m;
        this._subject = this._mailText.match(re)[1];

        return this;
    }

    parseContent() {
        const re = /[\s\S]*\n\n([\s\S]*)/;
        this._content = this._mailText.match(re)[1];

        return this;
    }

    parseSender() {
        const re = /^From: ?(.*)/m;
        this._sender = this._mailText.match(re)[1];

        return this;
    }

    parseReceivers() {
        const re = /(?:To: ?)((?:(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))[,\t\n ]*)*/;
        const matches = this._mailText.match(re);
        const hasReceivers = matches !== null;

        if (!hasReceivers) {
            this._isMigrated = true;
        } else {
            this._receivers = matches[0].split(',').map(x => x.replace(/(\s|\n)+/, '')).map(x => x.replace(/^To:/, '')).map(x => x.replace(/\n/, ''));
        }

        return this;
    }

    parseCcReceivers() {
        const re = /(?:Cc: ?)((?:(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))[,\t\n ]*)*/;
        const matches = this._mailText.match(re);
        const hasCcReceivers = matches !== null;

        if (!hasCcReceivers) {
            this._ccreceivers = [];
        } else {
            this._ccreceivers = matches[0].split(',').map(x => x.replace(/(\s|\n)+/, '')).map(x => x.replace(/^Cc:/, '')).map(x => x.replace(/\n/, ''));
        }

        return this;
    }

    parseBccReceivers() {
        const re = /(?:Bcc: ?)((?:(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))[,\t\n ]*)*/;
        const matches = this._mailText.match(re);
        const hasBccReceivers = matches !== null;

        if (!hasBccReceivers) {
            this._bccreceivers = [];
        } else {
            this._bccreceivers = matches[0].split(',').map(x => x.replace(/(\s|\n)+/, '')).map(x => x.replace(/^Bcc:/, '')).map(x => x.replace(/\n/, ''));
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
