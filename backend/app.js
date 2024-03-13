const express =require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors'); 
const path = require('path');

app.use(cors());

const errorMiddleware = require('./middleware/error');


require('dotenv').config({path:'backend/config/config.env'});



app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())

// Route Import
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order);

app.use(express.static(path.join(__dirname , '../frontend/build')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname , '../frontend/build/index.html'));
})

// middleware for error 
app.use(errorMiddleware);


module.exports = app;