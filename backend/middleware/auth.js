const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticated = catchAsyncError(async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler('login or signup for accessing the resource',401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_KEY);
    req.user = await User.findById(decodedData.id);
    next();
})

exports.authorizedRole = (...roles) => catchAsyncError((req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this path`,401));
    }
    next();
}) 