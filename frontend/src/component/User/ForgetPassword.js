import './forgetpassword.scss';
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from "react-hot-toast";
import Metadata from '../layout/Metadata';

const ForgetPassword = () => {
    const [email,setEmail] = useState("");
    const [isSubmit,setIsSubmit] = useState(false);

    const handleForgetPassword = async (e) =>{
        e.preventDefault();
        try { 
            setIsSubmit(true)                                        
            const response = await axios.put(`/api/v1/password/forgot`,{email});
            setIsSubmit(false)
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.error)
            setIsSubmit(false)
        }
    }


    return (
        <>
            <Metadata title={'Forgert Password --Ecommerce'} />        
            <div className="fullContainerForgetPassword">
                <div className='formContainerForgetPassword'>
                    <h1>Forget Password</h1>
                    <div className='forgetpassworddiv'>                    
                        <form onSubmit={handleForgetPassword} >
                            <input type="email" placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>                                
                            <input type="submit" value={"submit"} className={isSubmit ? 'notallowed' : ""}/>
                        </form>
                    </div>       
                </div>    
            </div> 
        </>
    )
}

export default ForgetPassword;