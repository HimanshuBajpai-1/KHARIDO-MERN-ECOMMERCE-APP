const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name Cannot exceed 30 characters"],
        minLength:[4,"Name cannot be less than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your email"],
        unique:true,
        validate:[validator.isEmail,"please Enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your password"],
        minLength:[8,"password can not be less than 4 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){              // used when we call update profile method
        next();
    }
    this.password = await bcrypt.hash(this.password , 10);
})

userSchema.method("generateJWT",function(){
    return jwt.sign({id:this._id},process.env.JWT_KEY,{
        expiresIn:process.env.JWT_EXPIRES_IN
    }); 
})

// function for comparing password
userSchema.method("comparePassword",async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
})

// Generating tokens for reset password
userSchema.method('getResetPasswordToken', function(){
    // generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hashing and addind resetPasswordToken to User Schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
})

const user = mongoose.model('user',userSchema);

module.exports=user;
