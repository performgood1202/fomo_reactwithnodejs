class BaseResponseModel {
    constructor(res) {
        this.res = res;
    }

    setHeader(key, value) {
        this.res.setHeader(key, value);
    }

    sendResponse(data, isSuccess, errMessage, status, param) {
        var responseObject = {
            data: data,
            isSuccess: isSuccess,
            errMessage: errMessage,
            outParam: param
        }
        this.res.statusCode = status;
        this.res.json(responseObject);
    }

    sendPlainResponse(data, isSuccess, errMessage, status, param) {
        var responseObject = data;

        this.res.json(responseObject);
    }

    responser(status, data, message) {
        let responseObject = {};

        if (data) {
            responseObject = {
                data: data,
                isSuccess: true,
                message: message,
            }
        } else {
            responseObject = {
                data: data,
                isSuccess: false,
                errMessage: message,
            } 
        }

        this.res.statusCode = status;
        this.res.json(responseObject);
    }
}

module.exports = BaseResponseModel;