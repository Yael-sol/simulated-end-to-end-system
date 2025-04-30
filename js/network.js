class Network {

    getRequest(myRequest) {
        myRequest = JSON.parse(myRequest);
        if (myRequest.IPDestination === '382.541.905.2') {
            myRequest = server2.unPack(JSON.stringify(myRequest));
        }
        else{
            myRequest = server1.unPack(JSON.stringify(myRequest));
        }
        return myRequest;
    }

}

let network = new Network();