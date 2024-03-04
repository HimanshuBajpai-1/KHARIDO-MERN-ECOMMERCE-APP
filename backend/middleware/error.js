const ErrorHandler = require('../utils/errorHandler')

module.exports = (err,req,res,next) => {
    err.status = err.status || 500;
    err.message = err.message || "Internal Server Error"
    // console.log(err);

    // wrong mongodb Id error
    if(err.name==="CastError"){
        const errMsg = `Invalid Id Format: ${err.name}`;
        err = new ErrorHandler(errMsg,400);
    }

    // Mongoose Duplicate key error
    if(err.code===11000){
        const errMsg = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(errMsg,400);
    }

    // wrong JWT Error
    if(err.name==="jsonWebTokenError"){
        const errMsg = `json Web Token is Invalid, Try again`;
        err = new ErrorHandler(errMsg,400);
    }

    // JWT Expire Error
    if(err.name==="TokenExpiredError"){
        const errMsg = `json Web Token is Expired, Try again`;
        err = new ErrorHandler(errMsg,400);
    }


    res.status(err.status).json({
        success : false,
        error : err.message
    });
}