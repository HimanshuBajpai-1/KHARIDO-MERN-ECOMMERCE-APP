import React, { useEffect, useState } from 'react'
import './accountdetails.scss';
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import Metadata from '../layout/Metadata';

const AccountDetails = () => {
    const navigate = useNavigate();
    const [loading , setLoading] = useState(true) 
    const {user}  = useSelector((state)=>state.userDetail);
    useEffect(()=>{        
        if(user.data) setLoading(false)
    },[user.data])   
    useEffect(()=>{
        if(!user.data && !user.isAuthenticated){
            navigate('/login')            
        }
    },[user.data,user.isAuthenticated,navigate])
    

  return (
    <>
        <Metadata title={'My Account --Ecommerce'} />
        {
            loading ? <Loader /> : <div className="container_profile">
        <div className="first">
            <h1>My Profile</h1>
            <img src={user.data && user.data.avatar.url} alt="myprofile" className='myprofile'/>
            <Link to={'/me/update'}>Edit Profile</Link>
        </div>
        <div className="second">
            <div>
                <p>Name:</p>
                <div className='info'>{user.data && user.data.name}</div>
            </div>
            <div>
                <p>Email:</p>
                <div className='info'>{user.data && user.data.email}</div>
            </div>
            <Link to={'/orders'}>My Orders</Link>
            <Link to={'/password/update'}>Change Password</Link>
        </div>
    </div>
        }
    </>
  )
}

export default AccountDetails