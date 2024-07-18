import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './Navbar.css';
import logo from '../Assets/command-center-logo.png';
import arrow from '../Assets/down-arrow.png';
import logouticon from '../Assets/logout.png';
import loginicon from '../Assets/login.png'

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [username, setUsername] = useState('');

  console.log('isAuthenticated:', isAuthenticated);
  if (isAuthenticated) {
    console.log('User:', user);
  }

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (isAuthenticated && user) {
          const response = await axios.get('http://localhost:4000/get-username', {
            params: { email: user.email }
          });

          console.log("Username: ", response.data.username);

          setUsername(response.data.username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [isAuthenticated, user]);

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
          <li><Link to="/my-decks">My Decks</Link></li>
          <li className="dropdown">
            <Link to="/collection">
              Collection
              <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" />
            </Link>
            <div className="dropdown-content">
              <Link to="/collection">My Collection</Link>
              <Link to="/build-a-deck">Build a Deck</Link>
              <Link to="/collection/all-cards">All Cards</Link>
            </div>
          </li>
          <li className="dropdown">
            <Link to="/blogs">
              Blogs
              <img id="dropdown-arrow" src={arrow} alt="Drop Down Arrow" />
            </Link>
            <div className="dropdown-content">
              <Link to="/blogs?filter=news">News</Link>
              <Link to="/blogs?filter=allBlogs">Explore</Link>
              <Link to="/blogs?filter=myBlogs">My Blogs</Link>
            </div>
          </li>
        </ul>
      </nav>
      {isAuthenticated ? (
        <div className="auth-buttons">
          <Link to="/account" className="username">
            <span>{username}</span>
          </Link>
          <button onClick={() => logout({ returnTo: window.location.origin })} className="username">
            <img src={logouticon} alt="Logout" className="logout-icon" />
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()} className="username">
          <p className="login-span">Login</p>
          <img src={loginicon} alt="Login" className="login-icon" />
        </button>
      )}
    </div>
  );
}

export default Navbar;