import React from 'react'
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <a href="/" className="footer-title">
        Zodiac Wonders
      </a>
      <div className="links">
        <p className="links-items">Contact Us</p>
        <p className="links-items">Review</p>
        <p className="links-items">FAQs</p>
      </div>
    </footer>
  );
}

export default Footer