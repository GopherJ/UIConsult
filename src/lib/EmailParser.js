/*
 * parse plain text emails and generate {Email}
 *
 * @Author: Cheng JIANG 
 * @Date: 2018-11-27 22:31:10 
 * @Last Modified by: Cheng JIANG
 * @Last Modified time: 2018-12-05 22:36:29
 */

const Email = require('./Email');
const { isNull } = require('../utils');
const { monthsMap } = require('../utils/constants');

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
        const re = /^Message-ID: ?<([^\r]*)>/m;
        const matches = this._mailText.match(re);

        if (!isNull(matches))
            this._id = matches.slice(1).pop();
        else
            this._id = '';

        return this;
    }

    parseDate() {
        const re = /^Date: ?(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), ([0-9]{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/m;
        const matches = this._mailText.match(re);

        if (!isNull(matches)) {
            let [
                d,
                m,
                y,
                hh,
                mm,
                ss
            ] = matches.slice(1);

            d = +d, m = +(monthsMap[m]) - 1, y = +y;
            hh = +hh + 8, mm = +mm, ss = +ss;

            this._date = new Date(y, m, d, hh, mm, ss);
        }

        return this;
    }

    parseSubject() {
        const re = /^Subject: ?([^\r]*)/m;
        const matches = this._mailText.match(re);

        if (!isNull(matches))
            this._subject = matches.slice(1).pop();
        else
            this._subject = '';

        return this;
    }

    parseContent() {
        const re = /[\s\S]*\r\n\r\n([\s\S]*)/;
        const matches = this._mailText.match(re);

        if (!isNull(matches))
            this._content = matches.slice(1).pop();
        else
            this._content = '';

        return this;
    }

    parseSender() {
        const re = /^From: ?([^\r]*)/m;
        const matches = this._mailText.match(re);
        
        if (!isNull(matches))
            this._sender = matches.slice(1).pop();
        else
            this._sender = '';

        return this;
    }

    parseReceivers() {
        const re = /To: ((([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})((,\s*)|(,\s*\r\n\s*)|()))*\r\n/;
        const matches = this._mailText.match(re);
        const hasReceivers = !isNull(matches);

        if (!hasReceivers)
            this._isMigrated = true, this._receivers = [];
        else
            this._receivers = matches[0].substring(4).split(/[^a-zA-Z-@\.]/g).filter(x => x);

        return this;
    }

    parseCcReceivers() {
        const re = /Cc: ((([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})((,\s*)|(,\s*\r\n\s*)|()))*\r\n/;
        const matches = this._mailText.match(re);
        const hasCcReceivers = !isNull(matches);

        if (!hasCcReceivers)
            this._ccreceivers = [];
        else
            this._ccreceivers = matches[0].substring(4).split(/[^a-zA-Z-@\.]/g).filter(x => x);

        return this;
    }

    parseBccReceivers() {
        const re = /Bcc: ((([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})((,\s*)|(,\s*\r\n\s*)|()))*\r\n/;
        const matches = this._mailText.match(re);
        const hasBccReceivers = !isNull(matches);

        if (!hasBccReceivers)
            this._bccreceivers = [];
        else
            this._bccreceivers = matches[0].substring(5).split(/[^a-zA-Z-@\.]/g).filter(x => x);

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
            this._id,
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

module.exports = EmailParser;
