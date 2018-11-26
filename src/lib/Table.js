const table = require('cli-table3');
const os = require('os');
const { execSync } = require('child_process');

const {
    isAll,
    isString
} = require('../utils');

/**
 * Table
 */
class Table {
    constructor(head) {
        this.cols = 80;

        this.updateCols();

        if (isAll(head, isString)) {
            this.tb = new table({
                head,
                colWidths: [1/6, 1/6, 1/6, 1/6].map(x => Math.floor(x * this.cols))
            });
        }
    }

    updateCols() {
        switch(os.platform()) {
        case 'darwin':
        case 'linux':
            this.cols = process.stdout.columns;
            break;
        case 'win32':
            const rs = execSync('mode con | findStr Columns').toString('utf8');
            const numMatches = rs.match(/(\d+)/);
            if (numMatches !== null) this.cols = +numMatches.slice(1).pop();
            break;
        }

        return this;
    }

    updateHead(head) {
        if (isAll(head, isString)) {
            this.updateCols();

            this.tb = new Table({
                head,
                colWidths: [1/6, 1/6, 1/6, 1/6, 1/6].map(x => Math.floor(x * this.cols))
            });
        }

        return this;
    }

    push(row) {
        if (isAll(row, isString)) this.tb.push(row);
        return this;
    }

    toString() {
        return this.tb.toString();
    }
}

module.exports = Table;