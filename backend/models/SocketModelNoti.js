class SocketModelNoti {


    constructor(client, accessToken, session) {
        this.clientId = client.id;
        this.client = client;
        this.accessToken = accessToken;
        this.session = session;
        this.user_id = session.id;
    }



    sendMessage(data, param) {


    }
}

module.exports = SocketModelNoti;