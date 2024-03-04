import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading:true,
    totalAmount : 0,
    orders : []
}

const getorderList = createSlice({
    name:'getOrderListAdmin',
    initialState,
    reducers : {
        getAllOrderList : (state , action) => {
            const {totalAmount , orders} = action.payload;
            state.totalAmount = totalAmount
            state.orders = orders
            state.loading = false;
        }
    }
})

export const {getAllOrderList} = getorderList.actions;
export default getorderList.reducer;
