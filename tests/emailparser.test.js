const EmailParser = require('../src/lib/EmailParser');
const { expect } = require('chai');

const txt = `Message-ID: <8229279.1075851877390.JavaMail.evans@thyme>\r
Date: Tue, 11 Jan 2000 09:45:00 -0800 (PST)\r
From: mike.riedel@enron.com\r
To: rick.cates@enron.com, butch.russell@enron.com, leo.nichols@enron.com,\r
Subject: Team Meeting Information\r
Mime-Version: 1.0\r
Content-Type: text/plain; charset=us-ascii\r
Content-Transfer-Encoding: 7bit\r
X-From: Mike Riedel\r
X-To: Rick Cates, Butch Russell, Leo Nichols, Rick Loveless, Ron Harkrader, Ron Beidelman, Larry Campbell, William Kendrick\r
X-cc:\r
X-bcc:\r
X-Folder: \\Larry_Campbell_Nov2001_1\\Notes Folders\\2000 goals and objectives\r
X-Origin: CAMPBELL-L\r
X-FileName: lcampbe.nsf\r
\r
\r
Rick, please please please see the attached files for the teams 2000 objectives`

const emailParser = new EmailParser(txt);
const email = emailParser.parseAndCreateEmail();

describe('EmailParser test', () => {
    it('Message-ID', () => {
        expect(email.id).to.be.equal('8229279.1075851877390.JavaMail.evans@thyme');
    });

    it('Subject', () => {
        expect(email.subject).to.be.equal('Team Meeting Information');
    });

    it('Sender', () => {
        expect(email.sender).to.be.equal('mike.riedel@enron.com');
    });

    it('Content', () => {
        expect(email.content).to.be.equal('Rick, please please please see the attached files for the teams 2000 objectives');
    });
});