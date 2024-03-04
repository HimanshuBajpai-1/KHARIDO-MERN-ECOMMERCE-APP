import React, { useEffect ,useState} from 'react';
import './usersadmin.scss';
import Sidebar from './Sidebar.js'
import {useDispatch, useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Metadata from '../layout/Metadata';
import {getAllUserList} from '../../slices/AdminSlice/getUserList.js';
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

const UsersAdmin = () => {
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
            const {data:d1} = await axios.get(`/api/v1/admin/users`);
              dispatch(getAllUserList(d1.allUsers));
            } catch (error) {
              toast.error(error.message)
            }
          }
          getDetails();
      }
    },[isAdmin,isAuthenticated,loading,navigate,dispatch])
  
    const {users:adminUsers,loading:userLoading} = useSelector((state) => state.adminAllUsers);
  
    const deleteUserHandler = async (id) => {
      try {      
        setDeleting(true);
        await axios.delete(`/api/v1/admin/user/${id}`);
        toast.success('User Deleted Successfully');
        navigate('/admin/dashboard'); 
        setDeleting(false);
      } catch (error) {
        setDeleting(false);
        toast.error(error.message);
      }
    }
  
    return (
      <>
        <Metadata title={'Users Admin --Ecommerce'} /> 
        <div className='adminUsersContainer'>
          <Sidebar />
            {
              !userLoading && adminUsers.length!==0 ? 
              <div className='tableUsers'>
                <table>
                  <thead>
                      <tr>
                          <th>User ID</th>
                          <th>Email</th>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Edit</th>
                          <th>Delete</th>
                      </tr>
                  </thead>
                  <tbody>
                  {
                    adminUsers.map(i=><tr key={i._id}>
                          <td>{i._id}</td>
                          <td >{i.email}</td>
                          <td>{i.name}</td>
                          <td className={i.role==='Admin' ? 'green' : 'red'}>{i.role}</td>
                          <td className='link'><Link to={`/admin/user/update/${i._id}`}><FaPencil /></Link></td>
                          <td>{deleting ? <span className='trash notAllowed'><FaTrash /></span> : <span className='trash' onClick={()=>deleteUserHandler(i._id)}><FaTrash /></span>}</td>
                      </tr>)
                  }
                  </tbody>
                </table>
              </div> : <h1 style={{color:'orangered'}}>No Users Yet</h1>
            }
          </div>
      </>
    )
}

export default UsersAdmin