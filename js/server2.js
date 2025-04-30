class Server2 {
    constructor() {
        this.url;
        this.request;
        this.server2IP = '382.541.905.2';
    }

    unPack(request) {
        this.request = JSON.parse(request);
        this.url = this.request.url.split(/[\?&=\/#]/);
        try {
            if (this.request.body.email) {
                switch (this.url[5]) {
                    case 'signUp':
                        if (dataBase.checkExistanceOfUser(this.request.body.email)) {
                            throw 404;
                        }
                        else {
                            dataBase.addNewUser(this.request);
                            this.request.status = 200;
                            return JSON.stringify(this.request);
                        }
                    case 'signIn':
                        if (!dataBase.checkExistanceOfUser(this.request.body.email))
                            throw 404;
                        else if (!dataBase.checkProprietyOfUser(this.request.body.password, this.request.body.email))
                            throw 400;
                        else{
                            this.request.status = 200;
                            return JSON.stringify(this.request);
                        }
                    default:
                        break;
                }

            }
        }
        catch (numberError) {
            this.request.status = numberError;
            this.request.body.response = null;
            return JSON.stringify(this.request);
        }
    }

}

let server2 = new Server2();