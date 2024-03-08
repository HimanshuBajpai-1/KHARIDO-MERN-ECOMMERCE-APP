const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const getToken = require('../utils/getToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const sendToken = require('../utils/getToken');
const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});


exports.userRegister = catchAsyncError(async (req,res,next)=>{
    const {name,email,password,public_id,url} = req.body;
    const newUser = await User.create({name,email,password,avatar:{
        public_id,
        url
    }})   

    getToken(newUser,200,res);                  // function for genrating tokens and saving it on cookie
})

exports.userLogin = catchAsyncError(async (req,res,next)=>{
    const {email , password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter email or Password",400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler("Invalid email or password",404));
    }

    const comparisonResult = await user.comparePassword(password);

    if(!comparisonResult){
        return next(new ErrorHandler("Invalid email or password",404));
    }
 
    getToken(user,201,res);                         // function for genrating tokens and saving it on cookie
})

exports.userLogout = catchAsyncError((req,res,next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true 
    })
    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})

exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler('User not Found',404));
    }
    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    // generating url for reset password
    const resetPasswordURL = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `your reset Password Token is: \n\n ${resetPasswordURL} \n\n if you have not requested for this email, then please ignore it.`
    
    try{
        await sendEmail({
            email : user.email,
            subject : 'KHARIDO Password Reset',
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    }catch(error){ 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500))
    }

})


exports.resetPassword = catchAsyncError(async (req,res,next)=>{
    
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    
    const user =await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new ErrorHandler('reset Password Token is invalid or has been Expired',400));
    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler('password does not match',400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    

    await user.save()

    getToken(user,201,res);
})

exports.getUserdetails = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne(req.user._id);
    res.status(200).json({
        success:true,
        user
    })
})

exports.updatePassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne(req.user._id).select('+password');
    const comparePasswordResult = await user.comparePassword(req.body.oldPassword);
    
    if(!comparePasswordResult){
        return next(new ErrorHandler('password does not match with old Passwored',400));
    }
    if( req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler('password does not match',400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
})

exports.updateProfile = catchAsyncError(async (req,res,next)=>{
    let newProfile = {
        name : req.body.name,
        email : req.body.email
    }
    if(req.body.public_id && req.body.url){
        newProfile.avatar={
            public_id:req.body.public_id,
            url:req.body.url,
        }
        const user = await User.findById(req.user._id);
        await cloudinary.uploader.destroy(user.avatar.public_id)
    }
    
    
    const updatedUser = await User.findByIdAndUpdate(req.user._id,newProfile,{
        new:true,
        validateBeforeSave:true
    })
    res.status(200).json({
        success:true,
        updatedUser
    })
})


// get all users -- admin

exports.getAllUsers = catchAsyncError(async (req,res,next)=>{
    const allUsers = await User.find();
    res.status(200).json({
        success :true,
        allUsers
    })
})

// get single User -- admin

exports.getSingleUser = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('User Not Found',400));
    }
    res.status(200).json({
        success :true,
        user
    })
})

// update User Profile/role -- admin

exports.updateProfileRoleByAdmin = catchAsyncError(async (req,res,next)=>{
    const newProfile = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role        
    }
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('User Not Found',400));
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id,newProfile,{
        new:true,
        validateBeforeSave:true
    })

    res.status(200).json({
        success:true,
        updatedUser
    })
})

// delete user -- admin

exports.removeProfileAdmin = catchAsyncError(async (req,res,next)=>{
    
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler('User Not Found',400));
    }
    await cloudinary.uploader.destroy(user.avatar.public_id); 
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"User Removed Successfully"
    })
})