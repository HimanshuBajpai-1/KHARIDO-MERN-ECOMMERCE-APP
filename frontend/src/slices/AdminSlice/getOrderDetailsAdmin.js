import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    loading : true,
    order : {}
}

const getOrder = createSlice({
    name : 'getOrderDetailsAdmin',
    initialState,
    reducers : {
        getOrderDetailsAdmin : (state , action) =>{
            state.loading = false;
            state.order = action.payload;
        }
    }
})

export const {getOrderDetailsAdmin} = getOrder.actions;
export default getOrder.reducer;