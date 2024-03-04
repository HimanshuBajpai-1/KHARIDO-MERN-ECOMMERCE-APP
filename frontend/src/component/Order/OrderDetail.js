import React, { useEffect } from 'react';
import './orderdetail.scss';
import {useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {getOrderDetail} from '../../slices/myOrderSlice/getOrderDetails'
import axios from 'axios';
import Loader from '../layout/Loader/Loader'
import {Card} from '../Cart/ConfirmOrder'
import Metadata from '../layout/Metadata';

const OrderDetail = () => {
    const dispatch = useDispatch();
    const {id} = useParams()
    useEffect(()=>{
        const getDetail = async ()=>{
            const response = await axios.get(`/api/v1/order/${id}`);
            dispatch(getOrderDetail(response.data.order));
        }
        getDetail();
    },[id,dispatch])
    const {order , loading} = useSelector((state)=>state.orderDetail)
  return (
    <>
        <Metadata title={'Order Detail --Ecommerce'} />
        {
            loading ? <Loader/> :
            <div className='orderdetail'>                    
                <p className='b_1'>OrderId: <span className='b_1_1'>{order._id}</span></p>
                <p>Name: <span>{order.user.name}</span></p>
                <p>Email: <span>{order.user.email}</span></p>
                <p>Phone No: <span>{order.shippingInfo.phoneNo}</span></p>
                <p>address : <span>{`${order.shippingInfo.address}, ${order.shippingInfo.city} (${order.shippingInfo.pincode}), ${order.shippingInfo.state}, ${order.shippingInfo.country}`}</span></p>
                <p>Delivery Status: <span className={order.orderStatus==='Delivered'?'green':'red'}>{order.orderStatus}</span></p>
                <p>Payment Status: <span className={order.paymentInfo.status==='Success'?'green':'red'}>{order.paymentInfo.status}</span></p>
                <p>Paid at: <span>{new Date(order.paidAt).toLocaleString()}</span></p>
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
    </>
  )
}

export default OrderDetail