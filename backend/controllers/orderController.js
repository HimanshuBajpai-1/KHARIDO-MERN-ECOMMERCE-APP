const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');


// create new order
exports.createNewOrder = catchAsyncError(async (req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;
    const newOrder = await Order.create({shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),user:req.user._id});
    res.status(201).json({
        success:true,
        newOrder
    })
})

// get single order 
exports.getSingleOrder = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new ErrorHandler("Order Not Found",404));
    }
    res.status(201).json({
        success:true,
        order
    })
})

// get all my order
exports.myOrders = catchAsyncError(async (req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    if(!orders){
        return next(new ErrorHandler("Order Not Found",404));
    }
    res.status(201).json({
        success:true,
        orders
    })
})


// get all orders  -- admin
exports.getAllOrders = catchAsyncError(async (req,res,next)=>{
    const orders = await Order.find();
    let totalAmount = 0
    orders.forEach((ord)=>{
        totalAmount+=ord.totalPrice
    })    
    res.status(201).json({
        success:true,
        totalAmount,
        orders
    })
})

// update order Status  -- admin
exports.updateOrder = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order Not Found",404));
    }
    if(order.orderStatus==='Delivered'){
        return next(new ErrorHandler("You have already deliverd this order",400));
    }
    if(req.body.status==='Shipped'){
        order.orderItems.forEach(async (o)=>{
            await updateStock(o.product,o.quantity);
        })
    }
    order.orderStatus = req.body.status;
    if(req.body.status === 'Delivered'){
        order.deliverdAt = Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        message:"status updated"
    })

})

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({validateBeforeSave:false});
}


// delete order  -- admin
exports.deleteOrders = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order Not Found",404));
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(201).json({
        success:true,
        message:"order deleted successfully"
    })
})