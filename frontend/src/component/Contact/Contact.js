import React from 'react'
import './contact.scss'
import { SiGooglebigquery } from "react-icons/si";
import { FaInstagramSquare,FaGithubSquare,FaLinkedin} from "react-icons/fa";
import Metadata from '../layout/Metadata';

const Contact = () => {
  return (
    <>
      <Metadata title={'Contact --Ecommerce'} />
      <div className='contact'>
        <SiGooglebigquery />
        <div className='textquery'>Any Query?</div>
        <div className='myMAil' >
          <a href={`mailto:${process.env.REACT_APP_MY_MAIL}`}>Mail me:{process.env.REACT_APP_MY_MAIL}</a>
        </div>
        <div className="icons">
            <a href={process.env.REACT_APP_MY_INSTAGRAM} target={'blank'}><FaInstagramSquare /></a>
            <a href={process.env.REACT_APP_MY_LINKEDIN} target={'blank'}><FaLinkedin /></a>
            <a href={process.env.REACT_APP_MY_GITHUB} target={'blank'}><FaGithubSquare /></a>
        </div>
    </div>
    </>
  )
}

export default Contact