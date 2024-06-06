import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import './Navbar.css';
import logo from '../Assets/command-center-logo.png';
import arrow from '../Assets/down-arrow.png';
import usericon from '../Assets/people.png';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  console.log('isAuthenticated:', isAuthenticated);
  if (isAuthenticated) {
    console.log('User:', user);
  }

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
            </div>
          </li>
        </ul>
      </nav>
      {isAuthenticated ? (
        <div className="auth-buttons">
          <Link to="/account" className="username">
            <span>{user.name}</span>
            <img id="user-icon" src={usericon} alt="User Icon" />
          </Link>
          <button onClick={() => logout({ returnTo: window.location.origin })} className="username">
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()} className="username">
          <span>Login</span>
          <img id="user-icon" src={usericon} alt="User Icon" />
        </button>
      )}
    </div>
    </div>
  );
}

export default Navbar;
