'use strict'


const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created'
}

class SuccessResponse {
    constructor(message, statusCode = STATUS_CODE.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {}) {
        // default is success
        // if statuscode and reason status code is not provided, assume it is success ( 200 )
        this.message = !message ? reasonStatusCode : message;
        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
        this.metadata = metadata;
    }

    send(res, header = {} ) {
        return res.status(this.statusCode).json({
            message: this.message,
            reasonStatusCode: this.reasonStatusCode,
            metadata: this.metadata
        });
    }
}

class OK extends SuccessResponse {
    constructor(message , metadata = {}) {
        super(message, metadata)
    }
}

class CREATED extends SuccessResponse {
    // pass in status code and reason status code to differentiate between success and created
    constructor(message, statuscode = STATUS_CODE.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata = {}) {
        super(message, statuscode, reasonStatusCode, metadata)
    }
}

module.exports = {
    SuccessResponse,
    OK,
    CREATED
}