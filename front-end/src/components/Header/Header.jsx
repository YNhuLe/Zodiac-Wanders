import React from 'react'
import "./Header.scss"

function Header() {
  return (
    <div className='header'>
        <div className="header__logo">
            <a href="/" className="header-title">
             Zodiac Wonders
            </a>
        </div>

        <div className="header__info">
            <h1>
                Explore the Magic of Your Zodiac
            </h1>
        </div>
    </div>
  )
}

export default Header