class Client {
    constructor() {
        this.date = null;
        this.myIP = '476.68.2.829';
        this.baseUrl = `https://www.caledar.com/api`;
    }

    createNewRequest(method, url, body, callback) {
        let Fajax = new FAJAX();
        const onStateChange = () => {
            if (Fajax.status === 200) {
                let data = Fajax.body.response;
                Fajax.status = '';
                callback(undefined, data);
            } else if (Fajax.status === 400) {
                callback('error 400', undefined);
            } else {
                callback('error 404', undefined);
            }
            Fajax.removeListener(onStateChange);
        };
        Fajax.removeListener(onStateChange);
        Fajax.addEventListener("stateChange", onStateChange, { once: true });
        Fajax.open(method, this.baseUrl + url, this.myIP);
        Fajax.send(JSON.stringify(body));
    }
}

let client = new Client();
    