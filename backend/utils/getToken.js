// function for genrating tokens and saving it on cookie
const getToken = (user,statuscode,res) => {
    const token = user.generateJWT();
    const options = { 
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.status(statuscode).cookie('token',token,options).json({
        success:true,
        token,
        user
    });     
}

module.exports = getToken