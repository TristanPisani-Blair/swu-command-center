import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import logo from '../Assets/command-center-logo.png';
import arrow from '../Assets/down-arrow.png';
import usericon from '../Assets/people.png';

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
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/how-to-play">How to Play</Link></li>
          <li className="dropdown"><Link to="/collection">
            Collection
            <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" /></Link>
            <div className="dropdown-content">
              <a href="#">My Collection</a>
              <a href="#">Build a Deck</a>
              <a href="#">Card Database</a>
            </div>
          </li>
          <li className="dropdown"><Link to="/blogs">
            <a href="#">Blogs</a>
            <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" /></Link>
            <div className="dropdown-content">
              <a href="#">News</a>
              <a href="#">Explore</a>
              <a href="#">My Blogs</a>
              <a href="#">New Blog Post</a>
            </div>
          </li>
        </ul>
      </nav>
      <Link to="/account" class="username">
        <span>Username</span>
        <img id="user-icon" src={usericon} alt="User Icon" />
      </Link>
    </div>
  );
}

export default Navbar;
