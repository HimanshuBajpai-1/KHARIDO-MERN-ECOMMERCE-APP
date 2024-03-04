import React from 'react'
import './notfound.scss';
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='notfound'>
      <div className='oops'>oops!</div>
      <div className='status'>404</div>
      <div className='text'>Page Not Found</div>
      <Link to={'/'}><button>Back To Homepage</button></Link>
    </div>
  )
}

export default NotFound