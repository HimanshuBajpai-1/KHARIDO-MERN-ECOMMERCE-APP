import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    user : {isAuthenticated:false,loading:false,isAdmin:false}
}

const loginSighnupUserDetails = createSlice({
    name:"getLoginSignupDetails",
    initialState,
    reducers : {
        getLoginSignupDetails : (state , action) => {
            const data = action.payload
            if(data.role==='Admin'){
                state.user = {isAuthenticated:true,loading:true,isAdmin:true,data}
            }else{
                state.user = {isAuthenticated:true,loading:true,isAdmin:false,data}
            }            
        },
        NotFoundUser : (state , action) => {
            state.user = {isAuthenticated:false,loading:true,isAdmin:false}
        }
        ,
        logOutUser : (state) => {
            state.user = {isAuthenticated:false,loading:false,isAdmin:false}
        },
        updateProfileDetails : (state , action) => {
            const data = action.payload
            if(data.role==='Admin'){
                state.user = {isAuthenticated:true,loading:true,isAdmin:true,data}
            }else{
                state.user = {isAuthenticated:true,loading:true,isAdmin:false,data}
            } 
        }
    }
})



export const {getLoginSignupDetails ,logOutUser,updateProfileDetails,NotFoundUser } = loginSighnupUserDetails.actions;
export default loginSighnupUserDetails.reducer;