const EmailParser = require('../src/lib/EmailParser');
const { expect } = require('chai');
const {
    words,
    uniqueWords,
    isOutsideWorkingHours 
} = require('../src/utils/index');

const txt = `Message-ID: <8229279.1075851877390.JavaMail.evans@thyme>\r
Date: Tue, 11 Jan 2000 09:45:00 -0800 (PST)\r
From: mike.riedel@enron.com\r
To: rick.cates@enron.com, butch.russell@enron.com, leo.nichols@enron.com,\r
    rick.loveless@enron.com, ron.harkrader@enron.com,\r
    ron.beidelman@enron.com, larry.campbell@enron.com,\r
    william.kendrick@enron.com\r
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


describe('test function utils', () => {
    const emailParser = new EmailParser(txt);
    const email = emailParser.parseAndCreateEmail();

    it('isOutsideWorkingHours', () => {
        expect(isOutsideWorkingHours(email.date)).to.be.equal(false);      
    });
    it('uniqueWords' , () => {
        expect(uniqueWords(email.subject)).to.be.eqls(['Team','Meeting','Information']);
    });
    it('words' , () => {
        expect(words(email.content)).to.be.eqls([ 'Rick', 'please','please','please','see','the','attached','files','for','the','teams','objectives' ]);
    });
});