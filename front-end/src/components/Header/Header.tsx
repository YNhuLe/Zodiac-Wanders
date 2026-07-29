import React from 'react'
import "./Header.scss"
import logo from "../../assets/images/logo.png";
function Header() {
  return (
    <div className="header">
      <div className="header__logo">
        <a href="/" className="header-title">
          <img src={logo} alt="logo" className="logo-img" />
        </a>
        <div className="header__info">
          <h1 className="header__subtitle">Explore the Magic of Your Zodiac</h1>
        </div>
      </div>
    </div>
  );
}

export default Header