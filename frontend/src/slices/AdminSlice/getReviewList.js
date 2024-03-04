import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reviews : [],
    loading:true,
}

const getreviewList = createSlice({
    name:'getReviewListAdmin',
    initialState,
    reducers : {
        getAllReviewList : (state , action) => {
            state.reviews = action.payload;
            state.loading = false;
        }
    }
})

export const {getAllReviewList} = getreviewList.actions;
export default getreviewList.reducer;
