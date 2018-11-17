import Email from './Email';

class EmailList {
    constructor() {
       this.emailList = [];
    }

    push(email) {
        this.emailList.push(email);

        return this;
    }

    pop() {
        return this.emailList.pop();
    }

    get(i) {
        return this.emailList[i];
    }

    length() {
        return this.emailList.length;
    }
}

export default EmailList;
