import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    productsList : []
}

const getProducts = createSlice({
    name:"getProducts",
    initialState,
    reducers : {
        getAllProducts : (state , action)=>{            
            state.productsList = action.payload.products           
        }
    }
})

export const { getAllProducts } = getProducts.actions;
export default getProducts.reducer;