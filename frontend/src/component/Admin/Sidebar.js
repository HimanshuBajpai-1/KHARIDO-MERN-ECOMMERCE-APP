import React, { useState } from 'react';
import './sidebar.scss';
import {Link} from 'react-router-dom'
import { BiSolidDashboard } from "react-icons/bi";
import { FaSitemap } from "react-icons/fa";
import { RiListUnordered } from "react-icons/ri";
import { RiAddLine } from "react-icons/ri";
import { RiUser3Fill } from "react-icons/ri";
import { AiTwotoneContainer } from "react-icons/ai";
import { MdReviews } from "react-icons/md";


const Sidebar = () => {
    const [productBtn , setProductBtn] = useState(false)
  return (
    <div className='sidebar'>
        <div className='b1'>
            <BiSolidDashboard />
            <Link to={'/admin/dashboard'}>DashBoard</Link>
        </div>
        <div className='b1_1'>
            <div className='b1'>
                <FaSitemap />
                <span onClick={()=>{setProductBtn(!productBtn)}}>Products</span>
            </div>
            <div className={productBtn ? 'productsNav visible' : 'hidden'}>
                <div className='b2'>
                    <RiListUnordered />
                    <Link to={'/admin/products'}>Products List</Link>
                </div>
                <div className='b2'>
                    <RiAddLine />
                    <Link to={'/admin/product/new'}>Add Product</Link>
                </div>
            </div>
        </div>
        <div className='b1'>
            <AiTwotoneContainer />
            <Link to={'/admin/orders'}>Orders</Link>
        </div>
        <div className='b1'>
            <RiUser3Fill />
            <Link to={'/admin/users'}>User</Link>
        </div>
        <div className='b1'>
            <MdReviews />
            <Link to={'/admin/reviews'}>Reviews</Link>
        </div>
    </div>
  )
}

export default Sidebar