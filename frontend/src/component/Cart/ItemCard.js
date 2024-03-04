import React from 'react'
import {getCartItems , removeCartItem} from '../../slices/orderSlice/getCartItem';
import {useDispatch} from 'react-redux';
import toast from 'react-hot-toast';
import {Link} from 'react-router-dom';

const ItemCard = ({item}) => {
    const dispatch = useDispatch();

    const incrementQuantity = (item) =>{
        const cq = item.quantity + 1;
        if(cq>item.stock) return;
        let currentItem = { ...item , quantity:cq}
        dispatch(getCartItems(currentItem))
    }

    const decrementQuantity = (item) =>{
        const cq = item.quantity - 1;
        if(cq<1) return;
        let currentItem = { ...item , quantity:cq}
        dispatch(getCartItems(currentItem))
    }

    const removeHandler = (item) =>{
        dispatch(removeCartItem(item));
        toast.success('Item Removed from Cart');
    }

    return (
        <div className='itemcard'>
            <div className='productInfo'>
                <Link to={`/product/${item.id}`}><img src={item.image} alt="itempic" /></Link>
                <div className='details_P'>
                    <div>{item.name}</div>
                    <div>₹{item.price}</div>
                    <div onClick={()=>removeHandler(item)}>remove</div>
                </div>
            </div>
            <div className='productQuantity'>
                <button onClick={()=>decrementQuantity(item)}>-</button>
                <input type="text" value={item.quantity} readOnly/>
                <button onClick={()=>incrementQuantity(item)}>+</button>
            </div>
            <div className='subtotal'>₹{item.price * item.quantity}</div>
        </div>
    )
}

export default ItemCard