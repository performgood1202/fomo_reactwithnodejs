const accountController = require('../controllers/accountController.js')
const appAccountController = require('../controllers/app/accountController.js')
const jwtHelper = require('../Util/jwtHelper');
const dbConstants = require('../Util/dbConstants.js');
const appConfig = require('../appConfig.json');
let appBaseResponse = require("../Util/appBaseResponse.js");

const send401 = (res) => {
    res.status(401)
    res.json()
}
const send403 = (res) => {
    res.status(403)
    res.json()
}

const authenticate = async (req, res, next) => {
    const Authorization = req.get('Authorization')
    let token = null;
    let result = null;
    if (Authorization) {
        token = Authorization.replace('Bearer ', '');
        try{
            
            result = await jwtHelper.decodeToken(token);

        }catch(e){
           send401(res);
           return

        }
        
    }


    if (null === token || result == null) {
        send401(res);
        return
    } else if (token == appConfig.superKey) {
        req.session = null;
        next();
    } else {
        var session = await accountController.getUserSession(token, req, res, next, send401);
    }


}

const isSuperAdmin = async (req, res, next) => {

	const { roleId } = req.session;
	const { superAdmin } = dbConstants.roles;

	if(roleId == superAdmin) {
		next();
	} else {
		send401(res);
	}
}

const isClubOwner = async (req, res, next) => {
	const { roleId } = req.session;
	const { clubOwner } = dbConstants.roles;

	if(roleId == clubOwner) {
		next();
	} else {
		send401(res);
	}
}
const isClubManager = async (req, res, next) => {
    const { roleId } = req.session;
    const { clubManager } = dbConstants.roles;

    if(roleId == clubManager) {
        next();
    } else {
        send401(res);
    }
}

const authenticateApp = async (req, res, next) => {
    const response = new appBaseResponse(res);
    const Authorization = req.get('Authorization')
    let token = null;
    let result = null;

    if (Authorization) {
        token = Authorization.replace('Bearer ', '');

        try{
            
            result = await jwtHelper.decodeToken(token);



        }catch(e){

           response.sendResponse(401, "Authetication failed", false, null);
           return

        }
        
    }

    if (null === token || result == null) {
        send401(res);
        return
    } else if (token == appConfig.superKey) {
        req.session = null;
        next();
    } else {
        var session = await appAccountController.getUserSession(token, req, res, next, send401);
    }

    
}
const isAppUser = async (req, res, next) => {
    const { roleId } = req.session;
    const { appUser } = dbConstants.roles;

    if(roleId == appUser) {
        next();
    } else {
        send401(res);
    }
}

module.exports = {
	authenticate,
	isSuperAdmin,
	isClubOwner,
    isClubManager,
    isAppUser,
    authenticateApp
}