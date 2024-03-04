import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders : []
}

const getOrderList = createSlice({
    name:'getAllOrdersList',
    initialState,
    reducers : {
        getAllOrders : (state , action) =>{
            const list = action.payload;
            state.orders = list
        }
    }
});

export const {getAllOrders} = getOrderList.actions;
export default getOrderList.reducer