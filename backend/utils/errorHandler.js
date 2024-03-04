class ErrorHandler extends Error{
    constructor(errMsg,status){
        super(errMsg)
        this.status = status
        // console.log("hi");
        Error.captureStackTrace(this,this.constructor)
    }
}
module.exports = ErrorHandler;