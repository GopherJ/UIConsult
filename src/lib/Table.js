/*
 * Table
 *
 * @Author: Cheng JIANG
 * @Date: 2018-11-23 12:11:54
 * @Last Modified by: Cheng JIANG
 * @Last Modified time: 2018-12-03 18:35:38
 */

const table = require('cli-table3');
const os = require('os');

const { execSync } = require('child_process');

const {
    isAll,
    isString,
    isNull,
    makeArray
} = require('../utils');

class Table {
    constructor(head) {
        this.updateHead(head);
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
            if (!isNull(numMatches)) this.cols = +numMatches.slice(1).pop();
            break;
        }

        return this;
    }

    updateHead(head) {
        if (!isAll(head, isString)) return this;

        this.updateCols(), this.tb = new table({
            head,
            colWidths: makeArray(head.length,  1 / (head.length + 1))
                .map(x => Math.floor(x * this.cols))
        });

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