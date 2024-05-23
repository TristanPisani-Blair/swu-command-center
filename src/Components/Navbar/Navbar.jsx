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
          <div className="main">SWU</div>
          <div className="sub">Command Center</div>
        </div>
      </div>
      <nav>
        <ul className="nav-menu">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/how-to-play">How to Play</Link></li>
          <li className="dropdown">
            <Link to="/collection">
              Collection
              <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" />
            </Link>
            <div className="dropdown-content">
              <Link to="/my-collection">My Collection</Link>
              <Link to="/build-a-deck">Build a Deck</Link>
              <Link to="/card-database">Card Database</Link>
            </div>
          </li>
          <li className="dropdown">
            <Link to="/blogs">
              Blogs
              <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" />
            </Link>
            <div className="dropdown-content">
              <Link to="/news">News</Link>
              <Link to="/explore">Explore</Link>
              <Link to="/my-blogs">My Blogs</Link>
              <Link to="/new-blog-post">New Blog Post</Link>
            </div>
          </li>
        </ul>
      </nav>
      <Link to="/account" className="username">
        <span>Username</span>
        <img id="user-icon" src={usericon} alt="User Icon" />
      </Link>
    </div>
  );
}

export default Navbar;
