import React, { useEffect, useState } from 'react'
import './products.scss'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAllProducts } from '../../slices/productSlice/getProducts';
import Loader from '../layout/Loader/Loader';
import {toast} from 'react-hot-toast'
import Product from '../../component/Home/ProductCard'
import Pagination from "react-js-pagination";
import Metadata from '../layout/Metadata'

const Products = () => {
    const ratingArray = [0,1,2,3,4,5];
    const categoryArray = ["shoes","mobile","laptop","shirt","food"];

    const [loading,setLoading] = useState(false);
    const [keyword,setKeyword] = useState("");
    const [currentPage,setCurrentPage] = useState(1);
    const [resultPerPage,setResultPerPage] = useState(1);
    const [productsCount,setProductsCount] = useState(1);
    const [priceRange,setPriceRange] = useState([0,30000]);
    const [ratings,setRatings] = useState(0);
    const [category,setCategory] = useState("");
    const [isOpen ,setIsOpen] = useState(false);

    const removeHandler = ()=>{
      setPriceRange([0,25000]);
      setRatings(0);
      setCategory("");
    }

    const setCurrentPageNo =(e)=>{
      setCurrentPage(e);
    }
    
    const {productsList} = useSelector((state)=>state.allProducts);
    const dispatch = useDispatch();

    useEffect(()=>{
    const getP = async () => {
      try {
        setLoading(true);
        let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}&ratings[gte]=${ratings}`
        if(category){
          link = `/api/v1/products?category=${category}&keyword=${keyword}&page=${currentPage}&price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}&ratings[gte]=${ratings}`
        }
        const {data} = await axios.get(link);
        setResultPerPage(data.resultPerPage);
        setProductsCount(data.productsCount);
        dispatch(getAllProducts(data));        
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.message)
      }
    }
    getP()      
  },[dispatch,keyword,currentPage,priceRange,ratings,category])
  return (
    <>
      <Metadata title={'Products --Ecommerce'} /> 
      <div className='inputdiv'>
          <input className='searchproduct' type="text" placeholder='search product here...' onChange={(e)=>setKeyword(e.target.value)} />
          <button className='filterBtn' onClick={()=>setIsOpen(!isOpen)}>Filters</button>
      </div>
      <div className={isOpen ? "filters": "hidden"}>
        <fieldset className='price'>
          <legend>Select Price Range</legend>
            <label htmlFor="minprice">minimum price</label>
            <input type="number" id='minprice' value={priceRange[0]} placeholder='min price' onChange={(e)=>setPriceRange([e.target.value,priceRange[1]])}/>
            <label htmlFor="maxprice">maximum price</label>
            <input type="number" id='maxprice' value={priceRange[1]} placeholder='max price' onChange={(e)=>setPriceRange([priceRange[0],e.target.value])}/>
        </fieldset>
        <fieldset className='rating'>
          <legend>Select Rating</legend>           
            <ul>
              {
                ratingArray.map((i,idx)=><li key={idx} onClick={()=>setRatings(i)}>{i}</li>)
              }
            </ul>
        </fieldset>
        <fieldset className='category'>
          <legend>Select Category</legend>           
            <ul>
              <li onClick={()=>setCategory("")}>all</li>
              {
                categoryArray.map((i,idx)=><li key={idx} onClick={()=>setCategory(i)}>{i}</li>)
              }
            </ul>
        </fieldset>
        <button className='removeFilter' onClick={removeHandler}>Remove Filters</button>
      </div> 
      {
        loading ? <Loader /> : 
            <>
              <h1>Products</h1>  
              <div className="productscontainer">        
                  <div className="containerdiv">                
                      {
                        productsList.map((i)=><Product key={i._id} product={i}/>)
                      }
                  </div>
              </div>  
            </>
      }       

      {
        productsList.length===resultPerPage && productsCount>resultPerPage && <div className="paginationBox">
        <Pagination 
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText={"Next"}
            prevPageText={"Prev"}
            firstPageText={"1st"}
            lastPageText={"Last"}
            itemClass='page-item'
            linkClass='page-link'
            activeClass='pageItemActive'
            activeLinkClass='pageLinkActive'
        />
      </div>
      }
    </>
  )
}

export default Products