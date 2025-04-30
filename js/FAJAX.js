class FAJAX extends EventTarget {
    constructor() {
        super();
        this.body = {
            data: ``,
            response: ``,
            password: '',
            email: '',
            name: ''
        }
        this.url;
        this.IPAddress;
        this.IPDestination;
        this.status = ``;
        this.method;
    }

    open(method, url, ip) {
        this.method = method;
        this.url = url;
        this.IPAddress = ip;
        url = url.split(/[\?&=\/#]/)[5];
        if (url === 'signUp' || url === 'signIn' ) {
            this.IPDestination = '382.541.905.2';
        }
        else{
            this.IPDestination = '382.541.905.1';
        }
    }

    send(data) {
        data = JSON.parse(data);
        this.body.name = data.name;
        this.body.email = data.email;
        this.body.password = data.password;
        if (data.event) { this.body.data = data.event };
        let response = network.getRequest(JSON.stringify(this));
        Object.assign(this, JSON.parse(response));
        if (this.status) {
            this.dispatchEvent(new Event("stateChange"));
        }
    }

    removeListener(listener) {
        if (this.eventListenerId) {
            this.removeEventListener("stateChange", listener);
            this.eventListenerId = null;
        }
    }
}