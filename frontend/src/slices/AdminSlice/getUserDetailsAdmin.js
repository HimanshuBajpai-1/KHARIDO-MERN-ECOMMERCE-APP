import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    loading : true,
    user : {}
}

const getUser = createSlice({
    name : 'getUserDetailsAdmin',
    initialState,
    reducers : {
        getUserDetailsAdmin : (state , action) =>{
            state.loading = false;
            state.user = action.payload;
        }
    }
})

export const {getUserDetailsAdmin} = getUser.actions;
export default getUser.reducer;