import './updatepassword.scss';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'; 
import Metadata from '../layout/Metadata';

const UpdatePassword = () => {
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [isSubmit,setIsSubmit] = useState(false);

    const navigate = useNavigate()
    const {user} = useSelector((state)=>state.userDetail);

    useEffect(()=>{
        if(!user.isAuthenticated){            
            navigate('/login');
        }  
        
    },[user.isAuthenticated,navigate])

    const handleUpdatePassword = async (e) =>{
        e.preventDefault();
        try { 
            setIsSubmit(true)                                          
            await axios.put(`/api/v1/password/update`,{oldPassword,newPassword,confirmPassword});
            setIsSubmit(false)
            navigate('/account')
            toast.success("Password Updated Successfully");
        } catch (error) {
            toast.error(error.response.data.error)
            setIsSubmit(false)
        }
    }


    return (
        <>
            <Metadata title={'Update Password --Ecommerce'} />        
            <div className="fullContainerUpdatePassword">
                <div className='formContainerUpdatePassword'>
                    <h1>Update Password</h1>
                    <div className='updatepassworddiv'>                    
                        <form onSubmit={handleUpdatePassword} >
                            <input type="password" placeholder='Enter Old Password' value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>                        
                            <input type="password" placeholder='Enter New Password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>                        
                            <input type="password" placeholder='Confirm New Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>                        
                            <input type="submit" value={"submit"} className={isSubmit ? 'notallowed' : ""}/>
                        </form>
                    </div>       
                </div>    
            </div> 
        </>
    )
}

export default UpdatePassword