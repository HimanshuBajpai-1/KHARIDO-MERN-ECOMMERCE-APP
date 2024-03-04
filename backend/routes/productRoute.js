const express =require('express');
const { getAllProduct , createNewProduct, updateProduct, deleteProduct, getProductDetail, createAndUpdateReview, getAllReviews, deleteReview , getAllProductAdmin } = require('../controllers/productController');
const {isAuthenticated , authorizedRole} = require('../middleware/auth');

const router = express.Router();

// creating new product -- admin
router.post('/admin/product/new',isAuthenticated,authorizedRole("Admin"),createNewProduct);

// getting all product list
router.get('/products',getAllProduct);

// getting all product list  -- admin
router.get('/admin/products',isAuthenticated,authorizedRole("Admin"),getAllProductAdmin);

// update Product  -- admin
router.put('/admin/product/:id',isAuthenticated,authorizedRole("Admin"),updateProduct);

// delete Product  -- admin
router.delete('/admin/product/:id',isAuthenticated,authorizedRole("Admin"),deleteProduct)

// getting Product details
router.get('/product/:id',getProductDetail)

// review Product
router.put('/review',isAuthenticated,createAndUpdateReview)

// Get all reviews of a product
router.get('/review',getAllReviews)

// deleting review of a product -- Admin
router.delete('/review',isAuthenticated,authorizedRole("Admin"),deleteReview)

module.exports = router;