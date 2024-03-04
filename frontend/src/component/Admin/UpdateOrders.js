import React, { useEffect ,useState} from 'react';
import './updateorder.scss';
import Sidebar from './Sidebar.js'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate,useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Metadata from '../layout/Metadata';
import {getOrderDetailsAdmin} from '../../slices/AdminSlice/getOrderDetailsAdmin.js'
import {Card} from '../Cart/ConfirmOrder';
import Loader from '../layout/Loader/Loader.jsx';

const UpdateOrders = () => {
  const {isAuthenticated , loading, isAdmin} = useSelector((state)=>state.userDetail.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();  
  const {id} = useParams();
  const [statusOrder ,setStatusOrder] = useState("");
  const [submitting , setSubmitting] = useState(false);

  useEffect(()=>{
    if(loading && !isAuthenticated){
      navigate('/login');
    }
    if(loading && isAuthenticated && !isAdmin){
      navigate('/');
      toast.error('Not Authorized to access this Resource');
    }
    if(loading && isAuthenticated && isAdmin){
      const getDetail = async ()=>{
        const response = await axios.get(`/api/v1/order/${id}`);
        dispatch(getOrderDetailsAdmin(response.data.order));
      }
      getDetail();
    }
  },[isAdmin,isAuthenticated,loading,navigate,dispatch,id])
  const {order , loading:orderLoading} = useSelector((state)=>state.adminOrderDetails)

  const updateStausHandler = async () =>{
    if(order.orderStatus==='Delivered'){
      toast.error('already deliverd! cannot update status');
      return;
    }
    if(!statusOrder){
      toast.error('select Order Status');
      return;
    }
    try {
      setSubmitting(true);
      await axios.put(`/api/v1/admin/order/${id}`,{status:statusOrder});
      toast.success('Status Updated Successfully');
      navigate('/admin/orders');
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      toast.error(error.message);
    }
    
  }
  return (
    <>
      <Metadata title={'Order Detail Admin --Ecommerce'} /> 
      <div className="adminOrderDetailsConatiner">
        <Sidebar />
          {          
            orderLoading ? <Loader/> :
            <div className='orderdetail'>                    
                <p className='b_1'>OrderId: <span className='b_1_1'>{order._id}</span></p>
                <p>Name: <span>{order.user.name}</span></p>
                <p>Email: <span>{order.user.email}</span></p>
                <p>Phone No: <span>{order.shippingInfo.phoneNo}</span></p>
                <p>address : <span>{`${order.shippingInfo.address}, ${order.shippingInfo.city} (${order.shippingInfo.pincode}), ${order.shippingInfo.state}, ${order.shippingInfo.country}`}</span></p>
                <p>Payment Status: <span className={order.paymentInfo.status==='Success'?'green':'red'}>{order.paymentInfo.status}</span></p>
                <p>Paid at: <span>{new Date(order.paidAt).toLocaleString()}</span></p>                
                <p>Current Order Status: <span className={order.orderStatus==='Delivered'?'green':'red'}>{order.orderStatus}</span></p>
                <div className="statuForm">
                  <h2>Set Order Status:</h2>
                  <div>
                    <select onChange={(e)=>setStatusOrder(e.target.value)}>
                      <option value="">select Status</option>
                      {order.orderStatus==='Processing' && <option value="Shipped">Shipped</option>}
                      {order.orderStatus==='Shipped' && <option value="Delivered">Delivered</option>}
                    </select>
                    <button className={submitting?'hidden':'statusBtn'} onClick={updateStausHandler}>Update Status</button>
                    <button className={submitting?'statusBtn':'hidden'} onClick={()=>{toast.error('Processing! Please Wait')}}>Processing!</button>
                  </div>
                </div>
                <h1>Products</h1>
                <div className="cartItems">                
                    {
                    order.orderItems.map(i=><Card key={i.product} item={i}/>)
                    }
                </div>
                <div className="priceDetail">
                    <h1>Price Details</h1>
                    <div>
                        <p>Price:</p>
                        <p>₹{order.itemsPrice}</p>
                    </div>
                    <div>
                        <p>Tax:</p>
                        <p>₹{order.taxPrice}</p>
                    </div>
                    <div>
                        <p>Shipping Charges:</p>
                        <p>₹{order.shippingPrice}</p>
                    </div>
                    <div className='last'>
                        <p>Final price:</p>
                        <p>₹{order.totalPrice}</p>
                    </div>
                </div>
            </div> 
        }
        </div>
    </>
  )
}

export default UpdateOrders;