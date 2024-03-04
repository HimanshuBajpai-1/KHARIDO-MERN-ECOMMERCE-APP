import React from 'react'
import './footer.scss'
import playstore from '../../../images/playstore.png'
import appstore from '../../../images/appstore.png'
import { FaInstagramSquare,FaGithubSquare,FaLinkedin} from "react-icons/fa";

const Footer = () => {
  return (
    <footer id='footer'>
      <div className="left">
        <h3>Download Our App</h3>
        <p>available on Android and IOS Mobile Phone</p>
        <img src={playstore} alt="playstore" />
        <img src={appstore} alt="appstore" />
      </div>
      <div className="middle">
        <h1>ECOMMERCE</h1>
        <p>we believe in quality products</p>
        <p style={{fontWeight:"bold"}}>@all right reserved</p>
      </div>
      <div className="right">
        <p>follow us on:</p>
        <article>
            <a href={process.env.REACT_APP_MY_INSTAGRAM} target={'blank'}><FaInstagramSquare /></a>
            <a href={process.env.REACT_APP_MY_LINKEDIN} target={'blank'}><FaLinkedin /></a>
            <a href={process.env.REACT_APP_MY_GITHUB} target={'blank'}><FaGithubSquare /></a>
        </article>
      </div>
    </footer>
  )
}

export default Footer