import {createSlice} from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cartItems') ? {cartItems : JSON.parse(localStorage.getItem('cartItems'))} : {cartItems : []}

const getCart = createSlice({
    name : 'getCartItems',
    initialState,
    reducers:{
        getCartItems : (state , action)=>{
            const product = action.payload;
            const isExist = state.cartItems.find(i=>i.product === product.product);
            if(isExist){
                const index = state.cartItems.findIndex(i=>i.product===product.product);
                state.cartItems.splice(index,1,product);
            }else{
                state.cartItems.push(product);
            }
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems));
        },
        removeCartItem : (state , action) =>{
            const product = action.payload;
            const index = state.cartItems.findIndex(i=>i.product===product.product);
            state.cartItems.splice(index,1);
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems));
        }
    }
})

export const { getCartItems ,removeCartItem } = getCart.actions;
export default getCart.reducer