const EmailParser = require('../src/lib/EmailParser');
const { expect } = require('chai');
const {
    words,
    uniqueWords,
    isOutsideWorkingHours } = require('../src/utils/index');

const txt = `Message-ID: <8229279.1075851877390.JavaMail.evans@thyme>
Date: Tue, 11 Jan 2000 09:45:00 -0800 (PST)
From: mike.riedel@enron.com
To: rick.cates@enron.com, butch.russell@enron.com, leo.nichols@enron.com,
    rick.loveless@enron.com, ron.harkrader@enron.com,
    ron.beidelman@enron.com, larry.campbell@enron.com,
    william.kendrick@enron.com
Subject: Team Meeting Information
Mime-Version: 1.0
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit
X-From: Mike Riedel
X-To: Rick Cates, Butch Russell, Leo Nichols, Rick Loveless, Ron Harkrader, Ron Beidelman, Larry Campbell, William Kendrick
X-cc:
X-bcc:
X-Folder: \\Larry_Campbell_Nov2001_1\\Notes Folders\\2000 goals and objectives
X-Origin: CAMPBELL-L
X-FileName: lcampbe.nsf

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