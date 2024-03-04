import React from 'react'
import './cartitems.scss';
import { useSelector } from 'react-redux';
import ItemCard from './ItemCard';
import Metadata from '../layout/Metadata'
import { MdRemoveShoppingCart } from "react-icons/md";
import {Link,useNavigate} from 'react-router-dom'

export const CartItems = () => {
    const navigate = useNavigate();
    const {cartItems} = useSelector((state) => state.cart);
    const {isAuthenticated} = useSelector((state)=>state.userDetail.user)
    const checkOutHandler = ()=> {
        if(!isAuthenticated){
            navigate('/login');
        }else{
            navigate('/shipping');
        }
    }
    return (
        <>
            <Metadata title={`Cart --Ecommerce`} /> 
            {
                cartItems.length < 1 ? <div className='noItem'>
                    <MdRemoveShoppingCart />
                    <div className='noItem_1'>No item in your cart</div>
                    <Link to={'/products'}>Check Out Products</Link>
                </div> :
                <div className="cartContainer">
                    <div className="heading">
                        <div className='divHead'>Product Details</div>
                        <div className='divHead'>Quantity</div>
                        <div className='divHead'>Subtotal</div>
                    </div>
                    <div className="cartItems">
                        {
                            cartItems.map((item)=><ItemCard key={item.product} item={item}/>)
                        }
                    </div>
                    <div className='last'>                    
                        <div className="totalPrice">
                            <div>Total:</div>
                            <div className='p1'>₹{cartItems.reduce((initial,current)=>initial+current.price*current.quantity,0)}</div>
                        </div>
                        <div className="checkout" onClick={checkOutHandler}>Check Out</div>
                    </div>
                </div>
            }
        </>
    )
}
