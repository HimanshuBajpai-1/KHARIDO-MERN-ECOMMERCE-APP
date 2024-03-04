import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    product : {}
}

const productDetails = createSlice({
    name:"getProductDetails",
    initialState,
    reducers : {
        getProductDetails : (state , action)=>{            
            state.product = action.payload.product           
        }
    }
})

export const { getProductDetails } = productDetails.actions;
export default productDetails.reducer;