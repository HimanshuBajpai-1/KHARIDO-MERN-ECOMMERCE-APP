const mongoose = require('mongoose');

const connectDatabase = () =>{  
    mongoose.connect(process.env.DB_URI)
    .then((data)=>{
        console.log(`connected on ${data.connection.host}`);
    })

    // since we are handling unhandled promise rejection so we dont need catch block here
}
module.exports = connectDatabase