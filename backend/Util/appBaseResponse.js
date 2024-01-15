class BaseResponseModel {
    constructor(res) {
        this.res = res;
    }

    setHeader(key, value) {
        this.res.setHeader(key, value);
    }

    sendResponse(status, message, isSuccess, data) {
        var responseObject = {
            status: status,
            message: message,
            isSuccess: isSuccess,
            data: data
        }
        this.res.statusCode = status;
        this.res.json(responseObject);
    }
    emptyResponse() {
        this.res.json();
    }


}

module.exports = BaseResponseModel;