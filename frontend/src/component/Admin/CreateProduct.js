import React, { useEffect, useState } from 'react'
import './createproduct.scss';
import Sidebar from './Sidebar';
import { GiCardboardBoxClosed } from "react-icons/gi";
import { TbFileDescription } from "react-icons/tb";
import { IoIosPricetag } from "react-icons/io";
import { GiConfirmed } from "react-icons/gi";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaImages } from "react-icons/fa";
import toast from 'react-hot-toast';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Metadata from '../layout/Metadata';

const CreateProduct = () => {
    const {isAuthenticated , loading, isAdmin} = useSelector((state)=>state.userDetail.user);
    const navigate = useNavigate()
    useEffect(()=>{
        if(loading && !isAuthenticated){
            navigate('/login');
        }
        if(loading && isAuthenticated && !isAdmin){
            navigate('/');
            toast.error('Not Authorized to access this Resource');
        }
    },[isAdmin,isAuthenticated,loading,navigate])

    const categoryArray = ["shoes","mobile","laptop","shirt","food"];
    const [name ,setName] = useState("");
    const [description ,setDescription] = useState("");
    const [price ,setPrice] = useState("");
    const [stock ,setStock] = useState("");
    const [category ,setCategory] = useState("");
    const [preview , setPreview] = useState([]);
    const [selectImages , setSelectImages] = useState([]);
    const [formSubmit , setFormSubmit] = useState(false);

    const imageHandler = (e) => {
        let imageObj = e.target.files;
        let previewURL = [];
        setPreview(previewURL);
        for (const image of imageObj) {
            previewURL.push(URL.createObjectURL(image)); 
        }       
        setPreview(previewURL);
        setSelectImages(e.target.files);
    }

    
    const createNewProductHandler = async (e) =>{
        e.preventDefault();
        try {         
            setFormSubmit(true)
            const formData = {name,description,price,stock,category};
            if(!name || !description || !price || !stock || !category){
                toast.error('Fill Product Details');    
                setFormSubmit(false);
                return;
            }
            if(selectImages.length===0){
                toast.error('Select Product Images')
                setFormSubmit(false);
                return;
            }
            let images = [];
            for (const img of selectImages) {
                const image = new FormData()
                image.append("file",img);                
                image.append("cloud_name",process.env.REACT_APP_CLOUD_NAME)
                image.append("upload_preset",process.env.REACT_APP_UPLOAD_PRESET)
                image.append('folder', 'ecommerce/productsEcommerce');

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
                images.push({public_id,url});
            }    
            formData.images = images; 
            await axios.post(`/api/v1/admin/product/new`,formData);
            toast.success('Product Created Successfully');
            navigate('/admin/dashboard');
            setFormSubmit(false);
        } catch (error) {
            toast.error(error.name)
            setFormSubmit(false);
        }
    }

    return (
        <div className="createProductContainer">
            <Metadata title={'Create Product Admin --Ecommerce'} />
            <Sidebar />
            <div className='createProduct'>
                <div className="formdiv">
                    <h1>New Product</h1>
                    <form onSubmit={createNewProductHandler}>
                        <div className='inputField'>
                            <GiCardboardBoxClosed />
                            <input type="text" placeholder='Product Name' value={name} onChange={(e)=>setName(e.target.value)}/>
                        </div>
                        <div className='inputField'>
                            <TbFileDescription />
                            <input type="text" placeholder='Product Description' value={description} onChange={(e)=>setDescription(e.target.value)}/>
                        </div>
                        <div className='inputField'>
                            <IoIosPricetag />
                            <input type="number" placeholder='Product Price' value={price} onChange={(e)=>setPrice(e.target.value)}/>
                        </div>
                        <div className='inputField'>
                            <GiConfirmed />
                            <input type="number" placeholder='Product Stock' value={stock} onChange={(e)=>setStock(e.target.value)}/>
                        </div>
                        <div className='inputField'>
                            <BiSolidCategoryAlt />
                            <select onChange={(e)=>setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {
                                    categoryArray.map((i,idx)=><option key={idx} value={i}>{i}</option>)
                                }
                            </select>
                        </div>
                        <div className='inputField'>
                            <FaImages />
                            <input type="file" accept='image/*' multiple onChange={imageHandler}/>
                        </div>
                        <div className='imgPreviewContainer'>
                        <div className='imgPreview'>                            
                            {
                                preview && preview.map((i,idx)=><img key={idx} src={i} alt='product'/>)
                            }
                        </div>
                        </div>
                        <input className={formSubmit ? "hidden" : ""} type="submit" value={"submit"}/>
                        <input type='submit' disabled  className={formSubmit ? "notAllowed" : "hidden"} />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateProduct