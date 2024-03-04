import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";
import {updateProfileDetails} from '../../slices/userSlice/getLoginSignupDetails';
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'; 
import './updateprofile.scss';
import Metadata from '../layout/Metadata';

const UpdateProfile = () => {
    const [avatar , setAvatar] = useState("");
    const [avatarPreview , setAvatarPreview] = useState('/user.png');
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [isSubmit,setIsSubmit] = useState(false);

    const navigate = useNavigate()
    const {user} = useSelector((state)=>state.userDetail);

    useEffect(()=>{
        if(user.data && user.isAuthenticated){            
            setName(user.data.name);
            setEmail(user.data.email);
            setAvatarPreview(user.data.avatar.url);
        }else{
            navigate('/login');
        }  
        
    },[user.data,user.isAuthenticated,navigate])

    const dispatch = useDispatch();
    const handleImageChange = (e)=>{
        if(e.target.files[0]){
            setAvatar(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        }        
    }

    const handleUpdate = async (e) =>{
        e.preventDefault();
        try {            
            let public_id = "";
            let url = "";
            setIsSubmit(true)
            if(avatar){
                const image = new FormData();
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
                public_id = imgData.public_id;
                url = imgData.url;                
            }                               
            const response = await axios.put(`/api/v1/me/update`,{name,email,public_id,url});
            dispatch(updateProfileDetails(response.data.updatedUser))
            setIsSubmit(false)
            navigate('/account')
            toast.success("Profile Updated Successfully")
        } catch (error) {
            toast.error(error.response.data.error)
            setIsSubmit(false)
        }
    }


  return (
    <>
        <Metadata title={'Update Profile --Ecommerce'} />        
        <div className="fullContainerUpdate">
            <div className='formContainerUpdate'>
                <h1>Update Profile</h1>
                <div className='updatediv'>                    
                    <form onSubmit={handleUpdate} >
                        <input type="text" placeholder='Enter Your Name' value={name} onChange={(e)=>setName(e.target.value)}/>                        
                        <input type="text" placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <div>
                            <img className='updateProfileImg' src={avatarPreview && avatarPreview} alt="avatar"/>
                            <input type="file" accept='image/*' name='image' onChange={handleImageChange}/>
                        </div>
                        <input type="submit" value={"submit"} className={isSubmit ? 'notallowed' : ""}/>
                    </form>
                </div>       
            </div>    
        </div>  
    </>
  )
}

export default UpdateProfile



