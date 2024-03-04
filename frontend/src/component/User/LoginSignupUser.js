import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";
import {getLoginSignupDetails} from '../../slices/userSlice/getLoginSignupDetails';
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'; 
import './loginsignupuser.scss'
import Metadata from '../layout/Metadata';

const LoginSignupUser = () => {
    const [avatar , setAvatar] = useState("");
    const [avatarPreview , setAvatarPreview] = useState('/user.png');
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [page,setPage] = useState(true);
    const [isSubmit,setIsSubmit] = useState(false);

    const navigate = useNavigate()
    const isAuthenticated = useSelector((state)=>state.userDetail.user.isAuthenticated);

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/account');
        }

    },[isAuthenticated , navigate])


    const dispatch = useDispatch();

    const handleLogin = async (e) =>{
        e.preventDefault();
        try {
            setIsSubmit(true)
            const {data} = await axios.post(`/api/v1/login`,{email,password});
            // console.log(data);
            dispatch(getLoginSignupDetails(data.user))
            setIsSubmit(false)
            setEmail("");
            setPassword("")
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            setIsSubmit(false)
        }
    }

    const handleImageChange = (e)=>{
        setAvatar(e.target.files[0]);
        setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleRegister = async (e) =>{
        e.preventDefault();
        try {
            setIsSubmit(true)
            if(avatar){
                const image = new FormData()
                image.append("file",avatar);
                image.append("cloud_name",process.env.REACT_APP_CLOUD_NAME)
                image.append("upload_preset",process.env.REACT_APP_UPLOAD_PRESET)
                image.append('folder', 'ecommerce/userProfile');
    
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
                    {
                        method : "POST",
                        body : image
                    }
                )   
                const imgData= await response.json();
                const public_id = imgData.public_id;
                const url = imgData.url;
                const {data} = await axios.post(`/api/v1/register`,{name,email,password,public_id,url});
                dispatch(getLoginSignupDetails(data.user))
                setIsSubmit(false)
                setName("");
                setEmail("");
                setPassword("");
            }else{
                toast.error('select a profile image');
                setIsSubmit(false)
            }        
        } catch (error) {
            toast.error(error.response.data.error)
            setIsSubmit(false)
        }
    }


  return (
    <>
        <Metadata title={'Login --Ecommerce'} />        
        <div className="fullContainer">
        <div className='formContainer'>
            <div className='buttonContainer'>
                <button onClick={()=>setPage(true)}>Login</button>
                <button onClick={()=>setPage(false)}>SignUp</button>
            </div>
            {
                page ? 
                <div className='logindiv'>
                    <form onSubmit={handleLogin} >
                        <input type="text" placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <input type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <Link to={'/password/forget'}>forgot password?</Link>
                        <input type="submit" value={"submit"} className={isSubmit ? 'notallowed' : ""}/>            
                    </form>
                    <Link onClick={()=>setPage(false)}>New User?</Link>
                </div> : 
                <div className='registerdiv'>                    
                    <form onSubmit={handleRegister} >
                        <input type="text" placeholder='Enter Your Name' value={name} onChange={(e)=>setName(e.target.value)}/>
                        <input type="text" placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <input type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <div>
                            <img className='profileImg' src={avatarPreview && avatarPreview} alt="avatar"/>
                            <input type="file" accept='image/*' name='image' onChange={handleImageChange}/>
                        </div>
                        <input type="submit" value={"submit"} className={isSubmit ? 'notallowed' : ""}/>
                    </form>
                    <Link onClick={()=>setPage(true)}>Already have an account?</Link>
                </div>
            }
        </div>    
        </div>  
    </>
  )
}

export default LoginSignupUser



