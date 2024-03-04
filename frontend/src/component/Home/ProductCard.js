import React from 'react'
import './home.scss'
import ReactStars from 'react-rating-stars-component'
import {Link} from 'react-router-dom'



const ProductCard = ({product}) => {
  const options = {
    edit:false,
    color:"rgba(20,20,20,0.1)",
    activeColor:"tomato",
    size:window.innerWidth > 768 ? 25 :10,
    value:product.ratings,
    isHalf:true
  }
  return (
    <Link className='productCard' to={`/product/${product._id}`}>
        <img src={product.images[0].url} alt={"shirt"} />
        <p>{product.name}</p>
        <div>
          <ReactStars {...options}/>
          <span className='rrev'>({product.reviews.length} reviews)</span>
        </div>
        <span>{`₹${product.price}`}</span>
    </Link>

  )
}

export default ProductCard