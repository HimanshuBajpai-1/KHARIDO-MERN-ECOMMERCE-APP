const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"]
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        maxLength:[8,"price cannot exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLength:[4,"stock cannot exceed 8 characters"],
        default:1
    },
    numberOfReview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref: "user",
                required: true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
        }
    ],
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const product = mongoose.model('product',productSchema);

module.exports=product;
