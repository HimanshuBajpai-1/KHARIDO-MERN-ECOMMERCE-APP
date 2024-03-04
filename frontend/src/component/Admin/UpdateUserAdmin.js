import React, { useEffect ,useState} from 'react';
import './updateuseradmin.scss';
import Sidebar from './Sidebar.js'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate,useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Metadata from '../layout/Metadata';
import {getUserDetailsAdmin} from '../../slices/AdminSlice/getUserDetailsAdmin.js'
import Loader from '../layout/Loader/Loader.jsx';

const UpdateUserAdmin = () => {
  const {isAuthenticated , loading, isAdmin} = useSelector((state)=>state.userDetail.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();  
  const {id} = useParams();
  const [statusRole ,setStatusRole] = useState("");
  const [submitting , setSubmitting] = useState(false);

  useEffect(()=>{
    if(loading && !isAuthenticated){
      navigate('/login');
    }
    if(loading && isAuthenticated && !isAdmin){
      navigate('/');
      toast.error('Not Authorized to access this Resource');
    }
    if(loading && isAuthenticated && isAdmin){
      const getDetail = async ()=>{
        const response = await axios.get(`/api/v1/admin/user/${id}`);
        dispatch(getUserDetailsAdmin(response.data.user));
      }
      getDetail();
    }
  },[isAdmin,isAuthenticated,loading,navigate,dispatch,id])
  const {user:adminUser , loading:userLoading} = useSelector((state)=>state.adminUserDetails)

  const updateRoleHandler = async () =>{
    if(adminUser.role==='Admin'){
      toast.error('cannot update status!');
      return;
    }
    if(!statusRole){
      toast.error('Select Role!');
      return;
    }
    try {
      setSubmitting(true);
      await axios.put(`/api/v1/admin/user/${id}`,{role:statusRole});
      toast.success('Role Updated Successfully');
      navigate('/admin/users');
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      toast.error(error.message);
    }    
  }

  return (
    <>
      <Metadata title={'User Detail Admin --Ecommerce'} /> 
      <div className="adminUserDetailsConatiner">
        <Sidebar />
          {          
            userLoading ? <Loader/> :
            <div className='userdetailAdmin'>                    
                <p className='b_1'>User Id: <span className='b_1_1'>{adminUser._id}</span></p>
                <p>Name: <span>{adminUser.name}</span></p>
                <p>Email: <span>{adminUser.email}</span></p>
                <p>Current Role: <span className={adminUser.role==='Admin'?'green':'red'}>{adminUser.role}</span></p>
                <div className="statuForm">
                  <h2>Set Role:</h2>
                  <div>
                    <select onChange={(e)=>setStatusRole(e.target.value)}>
                      <option value="">select Role</option>
                      {adminUser.role==='user' && <option value="Admin">Admin</option>}
                    </select>
                    <button className={submitting?'hidden':'statusBtn'} onClick={updateRoleHandler}>Update Role</button>
                    <button className={submitting?'statusBtn':'hidden'} onClick={()=>{toast.error('Processing! Please Wait')}}>Processing!</button>
                  </div>
                </div>                
            </div> 
        }
        </div>
    </>
  )
}

export default UpdateUserAdmin