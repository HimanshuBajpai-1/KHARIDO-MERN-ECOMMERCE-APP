import React, { useEffect, useState } from 'react';
import './productdetails.scss';
import {toast} from 'react-hot-toast';
import { useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {useDispatch,useSelector} from 'react-redux'
import {getProductDetails} from '../../slices/productSlice/getProductDetails';
import Loader from '../layout/Loader/Loader'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactStars from 'react-rating-stars-component';
import ReviewCard from './ReviewCard';
import Metadata from '../layout/Metadata'
import {getCartItems} from '../../slices/orderSlice/getCartItem'


const ProductDetails = () => {
    const {id} = useParams()
    const [loading ,setLoading ] = useState(false);
    const [quantity , setQuantity] = useState(1);
    const [reviewBtn , setReviewBtn] = useState(false);
    const [rating , setRating] = useState(0)
    const [review , setReview] = useState("");

    const { isAuthenticated , loading:userloading} = useSelector((state)=>state.userDetail.user);
    const {product} = useSelector((state)=>state.productDetail);

    const dispatch = useDispatch();
    useEffect(()=>{
        const getDetails = async ()=> {
            try {
                setLoading(true);
                const {data} = await axios.get(`/api/v1/product/${id}`);
                dispatch(getProductDetails(data));
                setLoading(false);
            } catch (error) {
                toast.error(error.message) 
                setLoading(false); 
            }
        }
        getDetails()
    },[dispatch,id])

    const options = {
        edit:false,
        color:"rgba(20,20,20,0.1)",
        activeColor:"tomato",
        size:window.innerWidth > 600 ? 40 :25,
        value:product.ratings,
        isHalf:true
    }
    
    const incrementQuantity = () =>{
        const cq = quantity + 1;
        if(cq>product.stock) return;
        setQuantity(cq);
    }

    const decrementQuantity = () =>{
        const cq = quantity - 1;
        if(cq<1) return;
        setQuantity(cq);
    }

    const cartHandler = () => {
        let item = {product:product._id,name:product.name,price:product.price,image:product.images[0].url,stock:product.stock,quantity}
        dispatch(getCartItems(item))
        toast.success('item added to Cart');
    }

    const navigate = useNavigate();
    const reviewBtnHandler = () => {      
        if(userloading && isAuthenticated){
            setReviewBtn(!reviewBtn)
        }else{
            toast.error('Please Login Before Giving Review')
            navigate('/login');            
        }
    }

    const changeRating = (new_rating)=>{
        setRating(new_rating);
    }

    const submitReview = async ()=>{   
        try {
            const reviewData = {
                productId:id,
                rating,
                comment:review,
            }
            await axios.put(`/api/v1/review`, reviewData)
            setReviewBtn(false);
            toast.success('review added Successfully');
            window.location.reload()
        } catch (error) {
            toast.error(error.message)
        }    
    }

    const reviewOptions = {
        color:"rgba(20,20,20,0.1)",
        activeColor:"tomato",
        size:window.innerWidth > 600 ? 40 :30,
        value:rating,
        isHalf:true,
    }

  return (
    <>
        <Metadata title={`${product.name} --Ecommerce`} /> 
        {
            loading ? <Loader /> :
            <>  
                <div className='container'>
                    <div className="left">
                        {
                            <Carousel className='carousel' showStatus={false} showThumbs={false} showArrows={false} autoPlay infiniteLoop interval={2000}>
                                {
                                    product.images && product.images.map((i,idx)=><img key={idx} src={i.url} alt="product"/>)
                                }
                            </Carousel>
                        }
                    </div>
                    <div className='right'>
                        <div className="block_1">
                            <h2>{product.name}</h2>
                            <p>{`Product #${product._id}`}</p>
                        </div>
                        <div className="block_2">
                            <ReactStars {...options}/> <span>({product.reviews && product.reviews.length} reviews)</span>
                        </div>
                        <div className="block_3">
                            <div className='price'>{`₹${product.price}`}</div>
                        </div>
                        <div className="block_4">
                            <div className="block_4_1">
                                <button onClick={decrementQuantity}>-</button>
                                <input style={{border:"1px solid"}} type="number" value={quantity} readOnly/>
                                <button onClick={incrementQuantity}>+</button>
                            </div>
                            <button disabled={product.stock>0 ? false : true} onClick={cartHandler}>Add to Cart</button>
                        </div>
                        <div className="block_5">
                            <p>Status:<span className={product.stock>0 ? 'green' : "red"}>{product.stock>0 ? 'In Stock' : "Out of Stock"}</span></p>
                        </div>
                        <div className="block_6">
                            Description:<p>{product.description}</p>
                        </div>
                        <div className="block_7">
                            <button onClick={reviewBtnHandler}>Submit Review</button>
                        </div>
                    </div>
                </div>
                {   
                    
                    reviewBtn ? 
                    <div className='reviewForm'>
                        <ReactStars {...reviewOptions} onChange={changeRating}/>
                        <textarea cols="30" rows="10" value={review} onChange={(e)=>setReview(e.target.value)} placeholder='Enter Review' required/>
                        <div className='btns'>                            
                            <button onClick={()=>setReviewBtn(false)}>cancel</button>
                            <button onClick={submitReview}>Submit</button>
                        </div>
                    </div> : ""
                }
                <div className="reviewsContainer">
                    <h1>Reviews</h1>
                    {
                        product.reviews && product.reviews[0] ? <div className="reviews">                        
                        {
                            product.reviews && product.reviews.map(i=><ReviewCard key={i._id} name={i.name} rating={i.rating} comment={i.comment} />)
                        }             
                    </div> :
                    <p>No Reviews Yet</p>
                    }
                </div>
            </>
        }
    </>
  )
}


export default ProductDetails