import React , { useEffect, useState }  from 'react'
import './updateproduct.scss'
import Sidebar from './Sidebar';
import { GiCardboardBoxClosed } from "react-icons/gi";
import { TbFileDescription } from "react-icons/tb";
import { IoIosPricetag } from "react-icons/io";
import { GiConfirmed } from "react-icons/gi";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaImages } from "react-icons/fa";
import toast from 'react-hot-toast';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import {useSelector , useDispatch} from 'react-redux';
import {getProductDetailsAdmin} from '../../slices/AdminSlice/getProductDetailsAdmin'
import Metadata from '../layout/Metadata';

const UpdateProduct = () => {
    const {isAuthenticated , loading, isAdmin} = useSelector((state)=>state.userDetail.user);
    const navigate = useNavigate();
    const {id} = useParams();
    const dispatch = useDispatch();

    const categoryArray = ["shoes","mobile","laptop","shirt","food"];
    const [name ,setName] = useState("");
    const [description ,setDescription] = useState("");
    const [price ,setPrice] = useState(0);
    const [stock ,setStock] = useState(0);
    const [category ,setCategory] = useState("");
    const [preview , setPreview] = useState([]);
    const [previewFromDB , setPreviewFromDB] = useState([]);
    const [selectImages , setSelectImages] = useState([]);
    const [formSubmit , setFormSubmit] = useState(false);
    
    useEffect(()=>{
        if(loading && !isAuthenticated){
            navigate('/login');
        }
        if(loading && isAuthenticated && !isAdmin){
            navigate('/');
            toast.error('Not Authorized to access this Resource');
        }
        if(loading && isAuthenticated && isAdmin){
            const getDetails = async () => {
            try {               
                const {data} = await axios.get(`/api/v1/product/${id}`);
                dispatch(getProductDetailsAdmin(data.product));  
                setName(data.product.name);
                setDescription(data.product.description);
                setPrice(data.product.price);
                setStock(data.product.stock);
                setCategory(data.product.category);
                setPreview(data.product.images.map(i=>i.url));
                setPreviewFromDB(data.product.images)
            } catch (error) {
                toast.error(error.message)
                }
            }
            getDetails();
        }
    },[isAdmin,isAuthenticated,loading,navigate,dispatch,id])


    const imageHandler = (e) => {
        let imageObj = e.target.files;
        let previewURL = [];
        for (const image of imageObj) {
            previewURL.push(URL.createObjectURL(image)); 
        }       
        setPreview(previewURL);
        setSelectImages(e.target.files);
    }

    
    const updateProductHandler = async (e) =>{
        e.preventDefault();
        try {         
            setFormSubmit(true)
            const formData = {name,description,price,stock,category};
            if(!name || !description || !price || !stock || !category){
                toast.error('Fill Product Details');    
                setFormSubmit(false);
                return;
            }
            if(preview.length===0){
                toast.error('select Image');
                setFormSubmit(false);
                return
            }
            if(selectImages.length===0){
                formData.images = previewFromDB
            }else{
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
            }             
            await axios.put(`/api/v1/admin/product/${id}`,formData);
            toast.success('Product Updated Successfully');
            navigate('/admin/dashboard');
            setFormSubmit(false);
        } catch (error) {
            console.log(error);
            toast.error(error.name)
            setFormSubmit(false);
        }
    }

    return (
        <div className="updateProductContainer">            
            <Metadata title={'Update Product Admin --Ecommerce'} /> 
            <Sidebar />             
            <div className='updateProduct'>
                <div className="formdiv">
                    <h1>Update Product</h1>
                    <form onSubmit={updateProductHandler}>
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
                            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                                <option value={""}>Select Category</option>
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

export default UpdateProduct