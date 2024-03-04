import React, { useEffect } from 'react'
import './allorders.scss'
import {useDispatch, useSelector} from 'react-redux'
import { Link, useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import {getAllOrders} from '../../slices/myOrderSlice/getOrderList';
import Loader from '../layout/Loader/Loader' 
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import Metadata from '../layout/Metadata';

const AllOrders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAuthenticated , loading} = useSelector((state)=>state.userDetail.user);
    useEffect(()=>{
        if(loading && !isAuthenticated){
            navigate('/login');
        }
        if(loading && isAuthenticated){
            const getList = async () =>{
                try {
                    const response = await axios.get(`/api/v1/orders/me`);
                    dispatch(getAllOrders(response.data.orders));
                } catch (error) {
                    toast.error(error.message);
                }
            }
            getList();
        }
    },[loading,dispatch,isAuthenticated,navigate]);
    const {orders} = useSelector((state)=>state.ordersList);
  return (
    <>
        <Metadata title={'My Orders --Ecommerce'} />
        {
            isAuthenticated ? <div className="myOrders">
                {
                    orders.length!==0 ? 
                    <div className='table'>
                    <table>
                        <thead>
                            <tr>
                                <th>OrderId</th>
                                <th>Payment Status</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Shipping Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            orders.map(i=><tr key={i._id}>
                                <td>{i._id}</td>
                                <td className={i.paymentInfo.status==='Success'?'green':'red'}>{i.paymentInfo.status}</td>
                                <td>{i.orderItems.length}</td>
                                <td>{i.totalPrice}</td>
                                <td className={i.orderStatus==='Delivered'?'green':'red'}>{i.orderStatus}</td>
                                <td className='link'><Link to={`/order/${i._id}`}><FaArrowUpRightFromSquare /></Link></td>
                            </tr>)
                        }
                        </tbody>
                </table></div> : <h1 className='warning'>No Orders Found</h1>
                }
            </div> : <Loader />
        }
    </>
  )
}

export default AllOrders