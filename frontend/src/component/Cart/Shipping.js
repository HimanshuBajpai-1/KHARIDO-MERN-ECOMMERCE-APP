import React, {  useEffect, useState } from 'react'
import './shipping.scss';
import { useSelector ,useDispatch } from 'react-redux';
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { IoHomeSharp } from "react-icons/io5";
import { BiSolidCity } from "react-icons/bi";
import { GiGreekTemple } from "react-icons/gi";
import { BiWorld } from "react-icons/bi";
import { TbMapPinCode } from "react-icons/tb";
import { FaPhoneSquare } from "react-icons/fa";
import { Country, State }  from 'country-state-city';
import {getShippingDetails} from '../../slices/orderSlice/getShipping'
import Metadata from '../layout/Metadata';
import Loader from '../layout/Loader/Loader';


const Shipping = () => {
    const navigate = useNavigate();
    const {isAuthenticated , loading} = useSelector((state)=>state.userDetail.user);
    const {cartItems} = useSelector((state)=>state.cart);
    const {shippingDetails } = useSelector((state) => state.shipping)

    useEffect(()=>{
        if(loading && !isAuthenticated){
          toast.error('Login to access the Resource');
          navigate('/login');
        }
        if(loading && isAuthenticated){
          if(cartItems.length===0){
            toast.error('Please add Some Products');
            navigate('/products');
          }
        }      
      },[navigate,cartItems,loading,isAuthenticated])

    const [phoneNo , setPhoneNo] = useState(shippingDetails.phoneNo);
    const [address , setAddress] = useState(shippingDetails.address);
    const [city , setCity] = useState(shippingDetails.city);
    const [pincode , setPincode] = useState(shippingDetails.pincode);
    const [state , setState] = useState(shippingDetails.state);
    const [country , setCountry] = useState(shippingDetails.country);

    const dispatch = useDispatch();
    const placeOrderHandler = (e) =>{
        e.preventDefault();
        if(!phoneNo || !address || !city || !pincode || !state || !country){
            toast.error('Please Fill up Form');
            return;
        }
        if(phoneNo.length > 10 || phoneNo.length < 10){
            toast.error('Invalid Phone Number');
            return;
        }
        const details = { phoneNo , address , city ,pincode ,state , country};
        dispatch(getShippingDetails(details))
        navigate('/orders/confirm');
    }



  return (
    <>
        <Metadata title={`Shipping Details --Ecommerce`} /> 
        {
            isAuthenticated ? <div className="shippingContainer">
            <div className="formContainer">
                <h1>Shipping Details</h1>
                <div>
                    <FaPhoneSquare />
                    <input type="number" placeholder='Phone No.' value={phoneNo} onChange={(e)=>setPhoneNo(e.target.value)} required/>
                </div>
                <div>
                    <IoHomeSharp />
                    <input type="text" placeholder='address' value={address} onChange={(e)=>setAddress(e.target.value)} required/>
                </div>
                <div>
                    <BiSolidCity />
                    <input type="text" placeholder='city' value={city} onChange={(e)=>setCity(e.target.value)} required/>
                </div>
                <div>
                    <TbMapPinCode />
                    <input type="number" placeholder='Pin Code' value={pincode} onChange={(e)=>setPincode(e.target.value)} required/>
                </div>
                <div>
                    <BiWorld />
                    <select onChange={(e)=>{setCountry(e.target.value)}}>
                        <option value="">country</option>
                        {
                            Country.getAllCountries().map(i=><option key={i.isoCode} value={i.isoCode}>{i.name}</option>)
                        }
                    </select>
                </div>
                {country && <div>
                    <GiGreekTemple />
                    <select onChange={(e)=>{setState(e.target.value)}}>
                        <option value="">state</option>
                        {
                            State.getStatesOfCountry(country).map(i=><option key={i.isoCode} value={i.isoCode}>{i.name}</option>)
                        }
                    </select>
                </div>   }  
                {
                    state && <button type='submit' onClick={placeOrderHandler}>Place Order</button>
                }           
            </div>
        </div> : <Loader />
        }
    </>
  )
}

export default Shipping