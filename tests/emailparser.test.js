const EmailParser = require('../src/lib/EmailParser');
const { expect } = require('chai');
const fs = require('fs');


describe('EmailParser test', () => {
    it('Message-ID', () => {
        fs.readFile('../mocks/mail.txt', (err, data) => {
            const emailParser = new EmailParser(data);
            const email = emailParser.parseAndCreateEmail();

            expect(email._id).to.be.equal('8229279.1075851877390.JavaMail.evans@thyme');
        });
    });
});