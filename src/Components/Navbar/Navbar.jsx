import React from "react";
import './Navbar.css';
import logo from '../Assets/command-center-logo.png';
import arrow from '../Assets/down-arrow.png';
import usericon from '../Assets/people.png';
import spacebkgd from '../Assets/hyperspace.jpg';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt='SWU Command Center Logo' />
        <div id="name">
          <div class="main">SWU</div>
          <div class="sub">Command Center</div>
        </div>
      </div>
      <nav>
        <ul className="nav-menu">
          <li><a href="#">Home</a></li>
          <li><a href="#">How to Play</a></li>
          <li className="dropdown">
            <a href="#">Collection</a>
            <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" />
            <div className="dropdown-content">
              <a href="#">My Collection</a>
              <a href="#">Build a Deck</a>
              <a href="#">Card Database</a>
            </div>
          </li>
          <li className="dropdown">
            <a href="#">Blog</a>
            <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" />
            <div className="dropdown-content">
              <a href="#">News</a>
              <a href="#">Explore</a>
              <a href="#">My Blogs</a>
              <a href="#">New Blog Post</a>
            </div>
          </li>
        </ul>
      </nav>
      <div class="username">
        <span>Username</span>
        <img id="user-icon" src={usericon} alt="User Icon" />
      </div>
    </div>
  );
}

export default Navbar;
