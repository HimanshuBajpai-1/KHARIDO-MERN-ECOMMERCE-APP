import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading : true,
    order : {}
}

const getDetail = createSlice({
    name:'getOrderDetail',
    initialState,
    reducers : {
        getOrderDetail : (state , action) =>{
            const detail = action.payload;
            state.loading = false
            state.order = detail
        }
    }
});

export const { getOrderDetail } = getDetail.actions;
export default getDetail.reducer