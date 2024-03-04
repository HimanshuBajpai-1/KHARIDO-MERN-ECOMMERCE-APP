import './App.scss';
import Home from './component/Home/Home';
import Footer from './component/layout/Footer/Footer';
import Header from './component/layout/Header/Header';
import { BrowserRouter,Routes ,Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast'
import ProductDetails from './component/Product/ProductDetails';
import Products from './component/Product/Products';
import LoginSignupUser from './component/User/LoginSignupUser';
import { useEffect } from 'react';
import axios from 'axios';
import {getLoginSignupDetails ,NotFoundUser} from './slices/userSlice/getLoginSignupDetails';
import {useDispatch} from 'react-redux';
import AccountDetails from './component/User/AccountDetails';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgetPassword from './component/User/ForgetPassword';
import ResetPassword from './component/User/ResetPassword';
import { CartItems } from './component/Cart/CartItems';
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import AllOrders from './component/Order/AllOrders';
import OrderDetail from './component/Order/OrderDetail';
import Dashboard from './component/Admin/Dashboard';
import ProductsAdmin from './component/Admin/ProductsAdmin';
import CreateProduct from './component/Admin/CreateProduct';
import UpdateProduct from './component/Admin/UpdateProduct';
import OrdersAdmin from './component/Admin/OrdersAdmin';
import UpdateOrders from './component/Admin/UpdateOrders';
import Contact from './component/Contact/Contact';
import NotFound from './component/layout/NotFound/NotFound';
import UsersAdmin from './component/Admin/UsersAdmin';
import UpdateUserAdmin from './component/Admin/UpdateUserAdmin';
import ReviewsAdmin from './component/Admin/ReviewsAdmin';
 
function App() {
  const dispatch = useDispatch();
  useEffect(() =>{
      const loadUser = async ()=>{
        try {
          const {data} = await axios.get(`/api/v1/me`);
          dispatch(getLoginSignupDetails(data.user));
        } catch (error) {
          dispatch(NotFoundUser());
        }
      }
      loadUser();
  },[dispatch])



  return (
    <BrowserRouter>
      <Toaster />
      <Header />   
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/contact'} element={<Contact />} />
        <Route path={'/product/:id'} element={<ProductDetails />} />
        <Route path={'/products'} element={<Products />} />
        <Route path={'/login'} element={<LoginSignupUser />}/>
        <Route path={'/account'} element={<AccountDetails />}/>
        <Route path={'/me/update'} element={<UpdateProfile />}/>
        <Route path={'/password/update'} element={<UpdatePassword />}/>
        <Route path={'/password/forget'} element={<ForgetPassword />}/>
        <Route path={'/password/Reset/:token'} element={<ResetPassword />}/>
        <Route path={'/cart'} element={<CartItems />}/>
        <Route path={'/shipping'} element={<Shipping />}/>
        <Route path={'/orders/confirm'} element={<ConfirmOrder />}/>
        <Route path={'/orders'} element={<AllOrders />}/>
        <Route path={'/order/:id'} element={<OrderDetail />}/>
        <Route path={'/admin/dashboard'} element={<Dashboard />}/>
        <Route path={'/admin/products'} element={<ProductsAdmin />}/>
        <Route path={'/admin/product/new'} element={<CreateProduct />}/>
        <Route path={'/admin/product/update/:id'} element={<UpdateProduct />}/>
        <Route path={'/admin/orders'} element={<OrdersAdmin />}/>
        <Route path={'/admin/order/update/:id'} element={<UpdateOrders />}/>
        <Route path={'/admin/users'} element={<UsersAdmin />}/>
        <Route path={'/admin/user/update/:id'} element={<UpdateUserAdmin />}/>
        <Route path={'/admin/reviews'} element={<ReviewsAdmin />}/>
        <Route path={'*'} element={<NotFound />}/>
      </Routes>
      <Footer />   
    </BrowserRouter>
  );
}

export default App;
