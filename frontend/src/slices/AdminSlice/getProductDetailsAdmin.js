import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    loading : false,
    product : {}
}

const getProduct = createSlice({
    name : 'getProductDetailsAdmin',
    initialState,
    reducers : {
        getProductDetailsAdmin : (state , action) =>{
            state.loading = true;
            state.product = action.payload;
        }
    }
})

export const {getProductDetailsAdmin} = getProduct.actions;
export default getProduct.reducer;