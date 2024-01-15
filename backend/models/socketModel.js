class SocketModel {


    constructor(client, accessToken, session,club_id) {
        this.clientId = client.id;
        this.client = client;
        this.accessToken = accessToken;
        this.session = session;
        this.club_id = club_id;
    }



    sendMessage(data, param) {


    }
}

module.exports = SocketModel;