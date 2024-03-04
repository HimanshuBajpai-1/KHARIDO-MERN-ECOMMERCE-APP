import {createSlice} from '@reduxjs/toolkit';

const initialState = localStorage.getItem('shippingDetails') ? {shippingDetails : JSON.parse(localStorage.getItem('shippingDetails'))} : {shippingDetails : {}}

const getShipping = createSlice({
    name : 'getShippingDetails',
    initialState,
    reducers:{
        getShippingDetails : (state , action)=>{
            const details = action.payload;
            state.shippingDetails = details;            
            localStorage.setItem("shippingDetails",JSON.stringify(state.shippingDetails));
        }
    }
})

export const { getShippingDetails } = getShipping.actions;
export default getShipping.reducer;