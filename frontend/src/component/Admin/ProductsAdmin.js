import React, { useEffect ,useState} from 'react';
import './productsadmin.scss';
import Sidebar from './Sidebar.js'
import {useDispatch, useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Metadata from '../layout/Metadata';
import {getAllProductList} from '../../slices/AdminSlice/getProductList';
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

const ProductsAdmin = () => {
  const [ deleting , setDeleting] = useState(false);
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
    if(loading && isAuthenticated && isAdmin){
        const getDetails = async () => {
          try {
            const {data:d1} = await axios.get(`/api/v1/admin/products`);  
            dispatch(getAllProductList(d1.products));
          } catch (error) {
            toast.error(error.message)
          }
        }
        getDetails();
    }
  },[isAdmin,isAuthenticated,loading,navigate,dispatch])

  const {products:adminProducts} = useSelector((state) => state.adminAllProducts);

  const deleteProductHandler = async (id) => {
    try {      
      setDeleting(true);
      await axios.delete(`/api/v1/admin/product/${id}`);
      toast.success('Product Deleted Successfully');
      navigate('/admin/dashboard');      
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      toast.error(error.message);
    }
  }

  return (
    <>
      <Metadata title={'Products Admin --Ecommerce'} /> 
      <div className='adminProductsContainer'>
        <Sidebar />
          {
            adminProducts ? 
            <div className='tableProducts'>
              <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                {
                  adminProducts.map(i=><tr key={i._id}>
                        <td>{i._id}</td>
                        <td>{i.name}</td>
                        <td>{i.stock}</td>
                        <td>{i.price}</td>
                        <td className='link'><Link to={`/admin/product/update/${i._id}`}><FaPencil /></Link></td>
                        <td>{deleting ? <span className='trash notAllowed'><FaTrash /></span> : <span className='trash' onClick={()=>deleteProductHandler(i._id)}><FaTrash /></span>}</td>
                    </tr>)
                }
                </tbody>
              </table>
            </div> : <h1>Products not Found</h1>
          }
        </div>
    </>
  )
}

export default ProductsAdmin