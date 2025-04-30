
class Server1 {
    constructor() {
        this.globalId = parseInt(localStorage.getItem('globalID'));
        if (isNaN(this.globalId)) {
            this.globalId = 0;
        }
        this.returnedData = null;
        this.url;
        this.request;
        this.server1IP = '382.541.905.1';
    }

    unPack(request) {
        this.request = JSON.parse(request);
        this.url = this.request.url.split(/[\?&=\/#]/);
        try {
            switch (this.request.method) {
                case 'GET':
                    this.manageGetRequest();
                    return JSON.stringify(this.request);
                case 'GET-ALL':
                    this.manageGetAllRequest();
                    return JSON.stringify(this.request);
                case 'POST':
                    this.managePostRequest();
                    return JSON.stringify(this.request);
                case 'PUT':
                    this.managePutRequest();
                    return JSON.stringify(this.request);
                case 'DELETE':
                    this.manageDeleteRequest();
                    return JSON.stringify(this.request);
                default:
                    break;
            }
        }
        catch (numberError) {
            this.request.status = numberError;
            this.request.body.response = null;
            return JSON.stringify(this.request);
        }
    }

    manageGetRequest() {
        if (!dataBase.checkExistanceOfUser(this.url[4])) {
            throw 404;
        }
        if (!isNaN(parseInt(this.url[8]))) {
            this.returnedData = dataBase.getData(this.url[6], this.url[8], this.url[4]);
        }
        else{
            this.returnedData = dataBase.checkExistanceOfEvent(this.url[6], this.url[4], this.request.body.data);
        }
        this.request.body.response = this.returnedData;
        this.request.status = 200;
    }

    manageGetAllRequest() {
        this.returnedData = dataBase.getAllData(this.url[4], this.url[9]);
        this.request.body.response = this.returnedData;
        this.request.status = 200;
    }

    managePutRequest() {
        dataBase.changeData(this.url[4], this.url[6], this.url[8], this.request.body.data);
        this.request.status = 200;
        this.request.body.response = this.request.body.data;
    }

    managePostRequest() {
        this.globalId++;
        dataBase.insertData(this.url[4], this.url[7], this.request.body.data, this.globalId);
        this.request.url += `/${this.globalId}`;
        this.request.status = 200;
        this.request.body.response = this.globalId;
        localStorage.setItem('globalID', this.globalId);
    }

    manageDeleteRequest() {
        this.returnedData = dataBase.deleteData(this.url[4], this.url[6], this.url[5]);
        this.request.status = 200;
        this.request.body.response = this.request.body.data;
    }
}

let server1 = new Server1();