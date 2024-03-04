const app = require('./app');
const connectDatabase = require('./config/databaseConnection')

// handling uncaughtException
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to uncaughtException`);
    process.exit(1) 
})


require('dotenv').config({path:'backend/config/config.env'});


// database connection
connectDatabase();


const port = process.env.PORT;

const server = app.listen(port,()=>{
    console.log(`listning on port ${port}`);
}) 

// unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    server.close(()=>{ 
        process.exit(1) 
    })
})