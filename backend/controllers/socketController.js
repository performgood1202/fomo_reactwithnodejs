

// const utils = require('../Util/utils')
// var jwt = require('jsonwebtoken')
// var Guid = require('guid')
// const appConfig = require('../appConfig.json');

const accountController = require('./accountController.js');

const jwtHelper = require('../Util/jwtHelper')

const SocketModel = require("../models/socketModel.js");
const SocketModelNoti = require("../models/SocketModelNoti.js");

var _ = require('lodash');
var clientTableOrder = [];
var clientTable = [];


var controller = {
    

    addNewClient: async (client) => {

        let accessToken = client.request._query.query;




        if (accessToken && jwtHelper.isValid(accessToken)) {


            let session = await accountController.getUserSessionForSocket(accessToken);

            if(session && session._id){
                if(session.roleId == "3"){



                    var existingClientOrder = _.find(clientTableOrder, { clientId: client.id });

                    if (!existingClientOrder){
                        let club = await accountController.getManagerClub(session._id);


                        if(club && club.club_id){
                            clientTableOrder.push(new SocketModel(client, accessToken, session, club.club_id));
                        }
                    }


                }

                var existingClient = _.find(clientTable, { clientId: client.id });

                
                if (!existingClient){
                    clientTable.push(new SocketModelNoti(client, accessToken, session));

                }

            }
        }

    },

    newOrderRecived: async (club_id, data) => {


        var activeClients = _.filter(clientTableOrder, { club_id: club_id });

      
        if (activeClients) {
            if (Array.isArray(activeClients)){
                activeClients.forEach(cur => {
                    cur.client.emit("newOrderRecived", data);
                });
            }else {
                activeClients.client.emit("newOrderRecived", data);
            }
        }

    },
    newNotificationRecived: async (user_id, data) => {


        var activeClients = _.filter(clientTable, { user_id: user_id });

        if (activeClients) {
            if (Array.isArray(activeClients)){
                activeClients.forEach(cur => {
                    cur.client.emit("newNotificationRecived", data);
                });
            }else {
                activeClients.client.emit("newNotificationRecived", data);
            }
        }

    },

    removeClient: async (client) => {
        _.remove(clientTable, { clientId: client.id });
    },

}

module.exports = controller;