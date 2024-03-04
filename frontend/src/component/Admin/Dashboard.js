import React, { useEffect } from 'react';
import './dashboard.scss'
import Sidebar from './Sidebar';
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Metadata from '../layout/Metadata';
import {getAllProductList} from '../../slices/AdminSlice/getProductList';
import {getAllUserList} from '../../slices/AdminSlice/getUserList'
import {getAllOrderList} from '../../slices/AdminSlice/getOrderList'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';import { Doughnut, Line } from "react-chartjs-2";


const Dashboard = () => {

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
            const {data:d2} = await axios.get(`/api/v1/admin/products`);
            const {data:d3} = await axios.get(`/api/v1/admin/orders`);     
            dispatch(getAllUserList(d1.allUsers));
            dispatch(getAllProductList(d2.products));
            dispatch(getAllOrderList({totalAmount:d3.totalAmount,orders:d3.orders}));
          } catch (error) {
            console.log(error);
            toast.error(error.message)
          }
        }
        getDetails();
    }
  },[isAdmin,isAuthenticated,loading,navigate,dispatch])

  const {products:adminProducts} = useSelector((state) => state.adminAllProducts)
  const {users:adminUsers} = useSelector((state) => state.adminAllUsers)
  const {totalAmount ,orders:adminOrders} = useSelector((state) => state.adminAllOrders)

  const totalProducts = adminProducts.length;
  const totalUsers = adminUsers.length;
  const totalOrders = adminOrders.length;

  let outOfStock = 0 ;
  for (let index = 0; index < adminProducts.length; index++) {
    if(adminProducts[index].stock===0) outOfStock++;    
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
  };    
  const lineChartData = {
    labels: ['Intitial Amount', 'Current Amount'],
    datasets: [
      {
        label: 'Total Sales',
        data: [0,totalAmount],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
  const doughnutData = {
    labels: ['OutOfStock','inStock'],
    datasets: [
      {
        data: [outOfStock,totalProducts-outOfStock],
        backgroundColor: [
          'blue',
          'purple',
        ],
        borderColor: [
          'blue',
          'purple',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
    <Metadata title={'Admin Dashboard --Ecommerce'} /> 
    <div className='dashboardContainer'>
        <Sidebar />
        <div className="content">
            <div className='totalsale'>
                Total Sale: <span>{`₹${totalAmount}`}</span>
            </div>
            <div className='roundContainer'>
              <div className='round r1'>
                <div>Products</div>
                <div>{totalProducts}</div>
              </div>
              <div className='round r2'>
                <div>Users</div>
                <div>{totalUsers}</div>
              </div>
              <div className='round r3'>
                <div>Orders</div>
                <div>{totalOrders}</div>
              </div>
            </div>
            <div className="lineChart">
                <Line options={lineChartOptions} data={lineChartData} />
            </div>
            <div className="doughnutChart">
              <Doughnut data={doughnutData} />
            </div>
        </div>
    </div>
    </>
  )
}

export default Dashboard