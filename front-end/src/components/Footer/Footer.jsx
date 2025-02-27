import React from 'react'
import "./Footer.scss";

function Footer() {
  return (
    <footer className='footer'>
        <a href="/" className="footer-title">
             Zodiac Wonders
            </a>
        <div className="links">
            <p>Contact Us</p>
            <p>Review</p>
            <p>FAQs</p>
        </div>
    </footer>
  )
}

export default Footer