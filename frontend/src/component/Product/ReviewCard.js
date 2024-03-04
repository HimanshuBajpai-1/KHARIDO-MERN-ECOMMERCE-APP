import React from 'react'
import user from '../../images/user.png';
import ReactStars from 'react-rating-stars-component'

const ReviewCard = ({name,rating,comment}) => {
  const options = {
        edit:false,
        color:"rgba(20,20,20,0.1)",
        activeColor:"tomato",
        size:window.innerWidth > 600 ? 30 :25,
        value:rating,
        isHalf:true
    }
  return (
    <div>
      <img src={user} alt="user" />
      <h2>{name}</h2>
      <ReactStars {...options} />
      <p>{comment}</p>
    </div>
  )
}

export default ReviewCard