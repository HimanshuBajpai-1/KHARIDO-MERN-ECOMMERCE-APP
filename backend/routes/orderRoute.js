const express =require('express');
const {isAuthenticated , authorizedRole} = require('../middleware/auth');
const { createNewOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrders } = require('../controllers/orderController');

const router = express.Router();

// create new order
router.post('/order/new',isAuthenticated,createNewOrder);

// get a order by id 
router.get('/order/:id',isAuthenticated,getSingleOrder);

// get all my orders
router.get('/orders/me',isAuthenticated,myOrders)

// get all orders  -- admin
router.get('/admin/orders',isAuthenticated,authorizedRole("Admin"),getAllOrders);

// update order status  -- admin
router.put('/admin/order/:id',isAuthenticated,authorizedRole("Admin"),updateOrder);

// delete order  -- admin
router.delete('/admin/order/:id',isAuthenticated,authorizedRole("Admin"),deleteOrders);

module.exports = router;