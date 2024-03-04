import {configureStore} from '@reduxjs/toolkit';
import getProducts from '../slices/productSlice/getProducts';
import getProductDetails from '../slices/productSlice/getProductDetails';
import getLoginSignupUserDetails from '../slices/userSlice/getLoginSignupDetails'
import getCart from '../slices/orderSlice/getCartItem';
import getShipping from '../slices/orderSlice/getShipping';
import getOrderList from '../slices/myOrderSlice/getOrderList';
import getOrderDetail from '../slices/myOrderSlice/getOrderDetails';
import getAdminProductList from '../slices/AdminSlice/getProductList';
import getAdminUserList from '../slices/AdminSlice/getUserList';
import getAdminOrderList from '../slices/AdminSlice/getOrderList';
import getAdminProductDetail from '../slices/AdminSlice/getProductDetailsAdmin';
import getAdminOrderDetail from '../slices/AdminSlice/getOrderDetailsAdmin';
import getAdminUserDetail from '../slices/AdminSlice/getUserDetailsAdmin';
import getAdminReviewList from '../slices/AdminSlice/getReviewList';

export const store = configureStore({
    reducer : {
        allProducts : getProducts,
        productDetail : getProductDetails,
        userDetail : getLoginSignupUserDetails,
        cart : getCart,
        shipping : getShipping,
        ordersList : getOrderList,
        orderDetail : getOrderDetail,
        adminAllProducts : getAdminProductList,
        adminAllUsers : getAdminUserList,
        adminAllOrders : getAdminOrderList,
        adminProductDetails : getAdminProductDetail,
        adminOrderDetails : getAdminOrderDetail,
        adminUserDetails : getAdminUserDetail,
        adminAllReviews : getAdminReviewList,
    },
})

