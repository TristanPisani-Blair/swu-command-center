import React from "react";
import { Link } from "react-router-dom";
import './Home.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import spacebkgd from '../Components/Assets/hyperspace.jpg';
import featuredeckimg from '../Components/Assets/mando3.png';
import bobafett from '../Components/Assets/boba fett.png'
import chewbacca from '../Components/Assets/chewy.png'
import darthvader from '../Components/Assets/vader2.png'

const Home = () => {
    return (
      <div>
        <Navbar />
          <div className="home-content">
            <div className="banner-container">
              <img src={spacebkgd} alt="Banner" className="banner" />
              <div className="banner-contents">
                <div className="banner-contents-left">
                  <h2>Featured Decks</h2>
                  <h3>Deck Name</h3>
                  <p>Published by User</p>
                </div>
                <div className="banner-contents-right">
                  <img src={featuredeckimg} alt="Featured Deck" className="featured-deck" />
                </div>
              </div>
            </div>
            <div className="box-container">
              <div className="left-boxes">
                <Link to="/blogs/news">
                  <div className="news-box">
                    <h3>News</h3>
                    <img src={bobafett} alt="News" />
                  </div>
                </Link>
                <Link to="/blogs/new">
                  <div className="blogs-box">
                    <img src={chewbacca} alt="Blogs" />
                    <h3>Blogs</h3>
                  </div>
                </Link>
              </div>
              <div className="right-box">
              <Link to="/collection/build-a-deck">
                <div className="build-a-deck-box">
                  <h3>Build a Deck</h3>
                  <img src={darthvader} alt="build-a-deck" />
                </div>
              </Link>
              </div>
            </div>
          </div>
        <Footer />
      </div>
    );
  }
  
  export default Home;
