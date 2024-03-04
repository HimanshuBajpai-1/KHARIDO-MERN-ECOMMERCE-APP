import React, { useEffect, useState } from 'react'
import './confirmorder.scss';
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import Metadata from '../layout/Metadata'
import Loader from '../layout/Loader/Loader'

const ConfirmOrder = () => {
    const navigate = useNavigate();
    const {cartItems} = useSelector((state)=>state.cart);
    const {user} = useSelector((state)=>state.userDetail);
    const {shippingDetails} = useSelector((state)=>state.shipping)
    const [itemsPrice , setItemsPrice] = useState(0);
    const [shippingPrice , setShippingPrice] = useState(0);
    const [totalPrice , setTotalPrice] = useState(0);
    const [taxPrice , setTaxPrice] = useState(0);
    

    useEffect(()=>{
      if(user.loading && !user.isAuthenticated){
        toast.error('Login to access the Resource');
        navigate('/login');
      }
      if(user.loading && user.isAuthenticated){
        if(cartItems.length===0){
          toast.error('Please add Some Products');
          navigate('/products');
        }
      }      
    },[navigate,cartItems,user.loading,user.isAuthenticated])

    const getPrice = () =>{
      const price = cartItems.reduce((initialValue ,current)=>initialValue + current.price * current.quantity,0 );
      setItemsPrice(price);
      const shipping = price > 1000 ? 0 : 300
      setShippingPrice(shipping);
      const tax = price * 0.18
      setTaxPrice(tax)
      setTotalPrice(price + tax + shipping);
    }

    useEffect(()=>{
      getPrice();
    })

    const paymentHandler =async () => {
      const order = {
      shippingInfo: shippingDetails,
      orderItems: cartItems,
      user : user.data._id,
      paymentInfo : { id : 'fake_id',status : "Success" },
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      }
      await axios.post(`/api/v1/order/new`,order);
      navigate('/orders');
      toast.success('Payment Successfull')
    }

  return (
    <>
      <Metadata title={`Confirm Order --Ecommerce`} /> 
        {
          user.isAuthenticated ?
          <div className="maindiv">
            <div className="first">
              <div className="shipingDetails">
                <p>Name : <span>{user.data.name}</span></p>
                <p>Email : <span>{user.data.email}</span></p>
                <p>Phone No : <span>{shippingDetails.phoneNo}</span></p>
                <p>address : <span>{`${shippingDetails.address}, ${shippingDetails.city} (${shippingDetails.pincode}), ${shippingDetails.state}, ${shippingDetails.country}`}</span></p>
              </div>
              <h1>Products</h1>
              <div className="cartItems">                
                {
                  cartItems.map(i=><Card key={i.product} item={i}/>)
                }
              </div>
            </div>
            <div className="second">
              <div>
                <p>Price:</p>
                <p>₹{itemsPrice}</p>
              </div>
              <div>
                <p>Tax:</p>
                <p>₹{taxPrice}</p>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <p>₹{shippingPrice}</p>
              </div>
              <div>
                <p>Final price:</p>
                <p>₹{totalPrice}</p>
              </div>
              <button onClick={paymentHandler} >{`Pay - ₹${totalPrice}`}</button>
            </div>
          </div> : <Loader />
        } 
    </>
  )
}

export const Card = ({item}) =>{
  return (
  <div className='card'>
    <div className='card_1'>
      <img className='card_2' src={item.image} alt="product" />
      <div className='card_3'>
        <p>{item.name}</p>
        <p className='price'>₹{item.price}</p>
        <p>Quantity :{item.quantity}</p>
      </div>
    </div>
    <div className='card_4'>
      <p>{`₹${item.price} * ${item.quantity} = ₹`}{item.price * item.quantity}</p>
    </div>
  </div>
)}

export default ConfirmOrder