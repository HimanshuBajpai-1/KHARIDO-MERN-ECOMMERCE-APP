import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users : [],
    loading:true,
}

const getuserList = createSlice({
    name:'getUserListAdmin',
    initialState,
    reducers : {
        getAllUserList : (state , action) => {
            state.users = action.payload;
            state.loading = false;
        }
    }
})

export const {getAllUserList} = getuserList.actions;
export default getuserList.reducer;
