import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products : []
}

const getproductList = createSlice({
    name:'getProductListAdmin',
    initialState,
    reducers : {
        getAllProductList : (state , action) => {
            state.products = action.payload;
        }
    }
})

export const {getAllProductList} = getproductList.actions;
export default getproductList.reducer;
