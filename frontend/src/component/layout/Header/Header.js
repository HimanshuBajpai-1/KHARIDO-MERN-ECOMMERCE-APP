import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import logo from '../../../images/logo.png';
import {FiShoppingBag } from 'react-icons/fi';
import { IoPersonCircleSharp } from "react-icons/io5";
import './header.scss'
import { HashLink } from 'react-router-hash-link';
import { FaUser } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import {useDispatch, useSelector} from 'react-redux'
import {logOutUser} from '../../../slices/userSlice/getLoginSignupDetails'
import axios from 'axios'

const Header = () => {
  const [open , setOpen ] = useState(false);
  
  const {cartItems} = useSelector((state) => state.cart);
  const { user } = useSelector((state)=>state.userDetail);

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const handleDashboard = ()=>{
    setOpen(false);
    navigate('/admin/dashboard');
  }
  const handleMyAccount = ()=>{
    setOpen(false);
    navigate('/account')
  }
  const handleMyOrders = ()=>{
    setOpen(false);
    navigate('/orders')
  }
  const handleLogOut = ()=>{
    setOpen(false);
    const callLogOut = async ()=>{
      try{
        await axios.get(`/api/v1/logout`);
        dispatch(logOutUser());
        toast.success('LogOut Successfull')
        navigate('/login')
      }catch(error){
        toast.error(error.message)
      }      
    }
    callLogOut();
  }

  return (
    <>
      <nav className='sheader'>
        <div className="first">
          <img src={logo} alt="logo" />
          <div className='icons'>
            <Link to={'/cart'}><FiShoppingBag /><span className='cartItemlength'>{cartItems.length}</span></Link>  
            {
              user.loading && user.isAuthenticated ? <div className='profileIcon'>
              <img alt='profile' className='profileImg' src={user.data.avatar.url} onClick={()=>setOpen(!open)}/>
              <div className={open ? "profileNav" : "hiddenProfileNav"}>
                {user.loading && user.isAdmin ? <div onClick={handleDashboard}><MdDashboard />Dashboard</div> : ""}
                <div onClick={handleMyAccount}><FaUser />My Account</div>
                <div onClick={handleMyOrders}><MdOutlineFormatListBulleted />My Orders</div>
                <div onClick={handleLogOut}><IoLogOutSharp />Log Out</div>                               
              </div>
            </div> : <Link to={'/login'}><IoPersonCircleSharp /></Link>
          }                  
          </div>
        </div>
        <div className="second">
          <div className='links'>
            <HashLink to={'/#home'}>Home</HashLink>
            <Link to={'/products'}>Products</Link>
            <Link to={'/contact'}>Contact</Link>
            <HashLink to={'/#footer'}>About</HashLink>
          </div>
        </div>       
      </nav>

      <nav className='lheader'>        
        <img src={logo} alt="logo" />        
        <div className='links'>
          <HashLink to={'/#home'}>Home</HashLink>
          <Link to={'/products'}>Products</Link>
          <Link to={'/contact'}>Contact</Link>
          <HashLink to={'/#footer'}>About</HashLink>
        </div>
        <div className='icons'>
          <Link to={'/cart'}><FiShoppingBag /><span className='cartItemlength'>{cartItems.length}</span></Link>
          {
            user.loading && user.isAuthenticated ? <div className='profileIcon'>
              <img alt='profile' className='profileImg' src={user.data.avatar.url} onClick={()=>setOpen(!open)}/>
              <div className={open ? "profileNav" : "hiddenProfileNav"}>
                {user.loading && user.isAdmin ? <div onClick={handleDashboard}><MdDashboard />Dashboard</div> : ""}
                <div onClick={handleMyAccount}><FaUser />My Account</div>
                <div onClick={handleMyOrders}><MdOutlineFormatListBulleted />My Orders</div>
                <div onClick={handleLogOut}><IoLogOutSharp />Log Out</div>                               
              </div>
            </div> : <Link to={'/login'}><IoPersonCircleSharp /></Link>
          }                              
        </div>
      </nav>
    </>
  )
}

export default Header