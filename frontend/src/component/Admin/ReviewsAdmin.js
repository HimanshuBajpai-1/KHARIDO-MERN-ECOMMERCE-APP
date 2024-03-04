import React, { useEffect ,useState} from 'react';
import './reviewsadmin.scss';
import Sidebar from './Sidebar.js'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Metadata from '../layout/Metadata';
import {getAllReviewList} from '../../slices/AdminSlice/getReviewList.js';
import { FaTrash } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";

const ReviewsAdmin = () => {
    const [ deleting , setDeleting] = useState(false);
    const [ finding , setFinding] = useState(false);
    const [productId , setProductId] = useState("");
    const {isAuthenticated , loading, isAdmin} = useSelector((state)=>state.userDetail.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
      if(loading && !isAuthenticated){
        navigate('/login');
      }
      if(loading && isAuthenticated && !isAdmin){
        navigate('/');
        toast.error('Not Authorized to access this Resource');
      }
    },[isAdmin,isAuthenticated,loading,navigate,dispatch])
  
  
    const deleteReviewHandler = async (reviewId) => {
      try {      
        setDeleting(true);
        await axios.delete(`/api/v1/review?productId=${productId}&reviewId=${reviewId}`);
        toast.success('Review Deleted Successfully');
        navigate('/admin/dashboard'); 
        setDeleting(false);
      } catch (error) {
        setDeleting(false);
        toast.error(error.message);
      }
    }
  
    const findProduct = async () => {
        try {
            setFinding(true);
            const response = await axios.get(`/api/v1/review?productId=${productId}`);
            dispatch(getAllReviewList(response.data.reviews));
            if(response.data.reviews.length===0){
                toast.error('No Review Found');
            }
            setFinding(false);
        } catch (error) {
            setFinding(false);
            toast.error(error.response.data.error);
        }
    }

    
    const {reviews:adminReviews,loading:reviewsLoading} = useSelector((state) => state.adminAllReviews);

    return (
      <>
        <Metadata title={'Reviews Admin --Ecommerce'} /> 
        <div className='adminReviewContainer'>
          <Sidebar />
          <div className="reviewContent">
            <div className="searchBar">
                <div>
                    <FaBoxOpen />
                    <input type="text" placeholder='Enter Product Id' value={productId} onChange={(e)=>setProductId(e.target.value)}/>
                </div>     
                <button className={finding ? 'hidden' : 'findingBtn'} onClick={findProduct}>Submit</button> 
                <button className={finding ? 'findingBtn' : 'hidden'} >Finding...</button>           
            </div>
                {
                    !reviewsLoading && adminReviews.length!==0 ? 
                    <div className='tableReviews'>
                    <table>
                    <thead>
                        <tr>
                            <th>ReviewId</th>
                            <th>User</th>
                            <th>Commment</th>
                            <th>Rating</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    adminReviews.map(i=><tr key={i._id}>
                            <td>{i._id}</td>
                            <td>{i.user}</td>
                            <td className='comment'>{i.comment}</td>
                            <td className={i.rating<3?'red':'green'}>{i.rating}</td>
                            <td>{deleting ? <span className='trash notAllowed'><FaTrash /></span> : <span className='trash' onClick={()=>deleteReviewHandler(i._id)}><FaTrash /></span>}</td>
                        </tr>)
                    }
                    </tbody>
                </table>
                </div> : <h1 style={{color:'orangered'}}>No Reviews</h1>
               }
          </div>
        </div>
      </>
    )
}

export default ReviewsAdmin



