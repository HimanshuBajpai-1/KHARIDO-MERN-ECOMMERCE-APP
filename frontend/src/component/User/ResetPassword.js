import './resetpassword.scss';
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from "react-hot-toast";
import Metadata from '../layout/Metadata';
import {useParams , useNavigate} from 'react-router-dom'

const ResetPassword = () => {
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [isSubmit,setIsSubmit] = useState(false);
    const {token} = useParams();
    const navigate = useNavigate();
    const handleResetPassword = async (e) =>{
        e.preventDefault();
        try {  
            setIsSubmit(true)                                        
            await axios.put(`/api/v1/password/reset/${token}`,{password,confirmPassword});
            setIsSubmit(false);
            toast.success("Password Reset Successfully");
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.error)
            setIsSubmit(false)
        }
    }


    return (
        <>
            <Metadata title={'Reset Password --Ecommerce'} />        
            <div className="fullContainerResetPassword">
                <div className='formContainerResetPassword'>
                    <h1>Reset Password</h1>
                    <div className='resetpassworddiv'>                    
                        <form onSubmit={handleResetPassword} >
                            <input type="password" placeholder='Enter New Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>                                
                            <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>                              
                            <input type="submit" value={"submit"} className={isSubmit ? 'notallowed' : ""}/>
                        </form>
                    </div>       
                </div>    
            </div> 
        </>
    )
}

export default ResetPassword;