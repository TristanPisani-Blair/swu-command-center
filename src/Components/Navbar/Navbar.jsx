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
              <Link to="/collection">My Collection</Link>
              <Link to="/collection/build-a-deck">Build a Deck</Link>
              <Link to="/collection/card-database">Card Database</Link>
            </div>
          </li>
          <li className="dropdown"><Link to="/blogs">
            Blogs
            <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" /></Link>
            <div className="dropdown-content">
              <Link to="/blogs/news">News</Link>
              <Link to="/blogs">Explore</Link>
              <Link to="/blogs/my-blogs">My Blogs</Link>
              <Link to="/blogs/new-blog-post">New Blog Post</Link>
            </div>
          </li>
        </ul>
      </nav>
      
      {/* Will need to change this when we implement functionality
      to check if user is signed in. */}
      <div className="account">
      <Link to="/login" className="login-link">
        <span>Login</span>
      </Link>
      <Link to="/account" className="account-link">
        <img id="user-icon" src={usericon} alt="User Icon" />
      </Link>
    </div>
    </div>
  );
}

export default Navbar;
