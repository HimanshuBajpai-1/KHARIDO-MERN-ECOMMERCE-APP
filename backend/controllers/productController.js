const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require('cloudinary').v2;

exports.getAllProduct = catchAsyncError(async (req,res) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;  
    res.status(200).send({ 
        success:true,
        products,
        productsCount,
        resultPerPage,
    }); 
})

exports.getAllProductAdmin = catchAsyncError(async (req,res) => {
    const products = await Product.find();  
    res.status(200).send({ 
        success:true,
        products
    }); 
})
 
exports.createNewProduct = catchAsyncError(async (req,res,next) =>{
    req.body.createdBy = req.user._id;
    const newProduct = await Product.create(req.body)
    res.status(201).send({
        success:true,
        newProduct
    })   
})

exports.updateProduct = catchAsyncError(async (req,res) =>{
    const id = req.params.id;
    const product = await Product.findById(id);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
    for (let index = 0; index < product.images.length; index++) {
        await cloudinary.uploader.destroy(product.images[index].public_id);
    }
    let updatedProduct = await Product.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
    res.send({success:true,updatedProduct});
})

exports.deleteProduct = catchAsyncError(async (req,res) =>{
    const id = req.params.id;
    const product = await Product.findById(id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
    for (let index = 0; index < product.images.length; index++) {
        await cloudinary.uploader.destroy(product.images[index].public_id);        
    }
    let deletedProduct = await Product.findByIdAndDelete(id);
    res.send({success:true,deletedProduct});
})

exports.getProductDetail = catchAsyncError(async (req,res,next) =>{
    const id = req.params.id;
    const product = await Product.findById(id);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
    res.send({success:true,product});
})

// to add or update the review
exports.createAndUpdateReview = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.body.productId);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404));
    }
    const {rating , comment} = req.body;
    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment
    }

    const isReviewed = product.reviews.find((rev) => {
        // console.log(rev);
        return rev.user.toString()===req.user._id.toString()
    })

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating = rating,
                rev.comment = comment
            }
        });
    }else{
        product.reviews.push(review);
        product.numberOfReview = product.reviews.length;
    }

    // finding overall rating
    let avg = 0
    product.reviews.forEach(rev=>avg+=rev.rating);
    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave:false}); 
    res.status(200).json({
        success:true,
        message:"review added succesfully"
    })
})

// Get all Reviews of Product

exports.getAllReviews = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404));
    }    
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

// deleting Reviews of a Product

exports.deleteReview = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler('Product Not Found',404));
    }  
    const newReviewArray = product.reviews.filter((rev)=>rev._id.toString()!==req.query.reviewId.toString());
    
    // finding overall rating after removing the desired review
    let avg = 0
    newReviewArray.forEach(rev=>avg+=rev.rating);
    const newRatings =0;
    if(newReviewArray.length!==0){
       newRatings = avg/newReviewArray.length;}
     
    const newNumberOfReview = newReviewArray.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews : newReviewArray,
        numberOfReview : newNumberOfReview,
        ratings : newRatings
    },{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        message:"review Deleted Succesfully"
    })
})