class DataBase {
    constructor() {
        this.users;
        this.indexOfUser;

    }

    checkExistanceOfUser(email) {
        if (JSON.parse(localStorage.getItem(email)))
            return true;
        return false;
    }

    checkProprietyOfUser(password, email) {
        if (JSON.parse(localStorage.getItem(email)).password === password)
            return true;
        return false;
    }

    getData(month, id, email) {
        let myEvent = JSON.parse(localStorage.getItem(email)).events[month][id];
        if (myEvent) {
            return myEvent;
        }
        throw 404;
    }

    checkExistanceOfEvent(month, email, event){
        let myEvents = JSON.parse(localStorage.getItem(email)).events[month];
        for(let key in myEvents){
            if ( myEvents[key].event === event.event && myEvents[key].date === event.date) {
                return myEvents[key];
            }
        }
        throw 404;
    }

    getAllData(email, month) {
        return JSON.parse(localStorage.getItem(email)).events[month];
    }

    insertData(email, month, dataToInsert, id) {
        let user = JSON.parse(localStorage.getItem(email));
        user.events[month][id] = dataToInsert;  
        localStorage.setItem(email, JSON.stringify(user));
    }

    deleteData(email, id, month) {
        let user = JSON.parse(localStorage.getItem(email));
        if (user.events[month][id]) {
            delete user.events[month][id];
            localStorage.setItem(email, JSON.stringify(user));
        }
        else { throw 404 };
    }

    changeData(email, id, month, newData) {
        let user = JSON.parse(localStorage.getItem(email));
        user.events[month][id] = newData;
        localStorage.setItem(email, JSON.stringify(user));
    }

    addNewUser(myRequest) {
        let newUser = {
            name: myRequest.body.name,
            password: myRequest.body.password,
            IPAddress: myRequest.ip,
            events: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}, 10: {}, 11: {}, 12: {} }
        }
        localStorage.setItem(myRequest.body.email, JSON.stringify(newUser));
    }
}
let dataBase = new DataBase();