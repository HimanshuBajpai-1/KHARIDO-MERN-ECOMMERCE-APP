import React, { useEffect ,useState} from 'react';
import './orderadmin.scss';
import Sidebar from './Sidebar.js'
import {useDispatch, useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Metadata from '../layout/Metadata';
import {getAllOrderList} from '../../slices/AdminSlice/getOrderList.js';
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

const OrdersAdmin = () => {
  const [ deleting , setDeleting] = useState(false);
  const {isAuthenticated , loading, isAdmin} = useSelector((state)=>state.userDetail.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(()=>{
    if(loading && !isAuthenticated){
      navigate('/login');
    }
    if(loading && isAuthenticated && !isAdmin){
      navigate('/');
      toast.error('Not Authorized to access this Resource');
    }
    if(loading && isAuthenticated && isAdmin){
        const getDetails = async () => {
          try {
            const {data:d1} = await axios.get(`/api/v1/admin/orders`);  
            dispatch(getAllOrderList({totalAmount:d1.totalAmount,orders:d1.orders}));
          } catch (error) {
            toast.error(error.message)
          }
        }
        getDetails();
    }
  },[isAdmin,isAuthenticated,loading,navigate,dispatch])

  const {orders:adminOrders,loading:ordersLoading} = useSelector((state) => state.adminAllOrders);

  const deleteOrderHandler = async (id) => {
    try {      
      setDeleting(true);
      await axios.delete(`/api/v1/admin/order/${id}`);
      toast.success('Order Deleted Successfully');
      navigate('/admin/dashboard'); 
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      toast.error(error.message);
    }
  }

  return (
    <>
      <Metadata title={'Orders Admin --Ecommerce'} /> 
      <div className='adminOrdersContainer'>
        <Sidebar />
          {
            !ordersLoading && adminOrders.length!==0 ? 
            <div className='tableOrders'>
              <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Item Qty</th>
                        <th>Amount</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                {
                  adminOrders.map(i=><tr key={i._id}>
                        <td>{i._id}</td>
                        <td className={i.orderStatus==='Delivered' ? 'green' : 'red'}>{i.orderStatus}</td>
                        <td>{i.orderItems.length}</td>
                        <td>{i.totalPrice}</td>
                        <td className='link'><Link to={`/admin/order/update/${i._id}`}><FaPencil /></Link></td>
                        <td>{deleting ? <span className='trash notAllowed'><FaTrash /></span> : <span className='trash' onClick={()=>deleteOrderHandler(i._id)}><FaTrash /></span>}</td>
                    </tr>)
                }
                </tbody>
              </table>
            </div> : <h1 style={{color:'orangered'}}>No Orders Yet</h1>
          }
        </div>
    </>
  )
}


export default OrdersAdmin