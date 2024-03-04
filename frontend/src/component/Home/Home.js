import React, { useEffect, useState } from 'react'
import './home.scss'
import { FaMouse } from "react-icons/fa";
import Product from './ProductCard';
import {HashLink} from 'react-router-hash-link'
import Metadata from '../layout/Metadata';
import axios from 'axios'
import {useSelector , useDispatch} from 'react-redux'
import {getAllProducts} from '../../slices/productSlice/getProducts'
import {toast} from 'react-hot-toast'
import Loader from '../layout/Loader/Loader';

const Home = () => {
  
  const [loading,setLoading] = useState(false);    
 
  const {productsList} = useSelector((state)=>state.allProducts)

  const dispatch = useDispatch();
  useEffect(()=>{
    const getP = async () => {
      try {
        setLoading(true);
        const {data} = await axios.get(`/api/v1/products`);
        dispatch(getAllProducts(data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message)
      }
    }
    getP()      
  },[dispatch])

  return (
    <>  
        <Metadata title={'Home --Ecommerce'} />        
        {
          loading ? <Loader /> : 
          <>
          <div className="home1" id="home">
              <h1>Welcome to KHARIDO</h1>
              <p>Find Amazing Products Below</p>
              <HashLink to="#home2"><button >scroll <FaMouse /></button></HashLink>
          </div>         
          <div className="home2"  id="home2">
              <h1>Featured Products</h1>
              <div className="homeContainer">
                  {
                    productsList.map((i)=><Product key={i._id} product={i}/>)
                  }
              </div>
          </div>
          </>
        }
    </>
  )
}

export default Home