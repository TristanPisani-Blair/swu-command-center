import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Home.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import featuredeckimg from '../Components/Assets/mando3.png';
import bobafett from '../Components/Assets/boba fett.png'
import chewbacca from '../Components/Assets/chewy.png'
import darthvader from '../Components/Assets/vader3.png';
import trooper from '../Components/Assets/trooper2.png';

const Home = () => {
  const [featuredDeckName, setFeaturedDeckName] = useState('Deck Name');
  const [featuredDeckPublisherName, setFeaturedDeckPublisherName] = useState('Publisher Name');

  const updateFeaturedDeck = (newDeckName) => {
    setFeaturedDeckName(newDeckName);
  };

  const updateFeaturedDeckPublisher = (newPublisherName) => {
    setFeaturedDeckPublisherName(newPublisherName);
  };


    return (
      <div>
        <Navbar />
          <div className="home-content">

            <div className="home-banner">
              <div className="banner-contents-background">
                <div className="banner-left">
                  <h2>Featured Decks</h2>
                  <h1 className="featured-deck-name">{featuredDeckName}</h1>
                  <p className="featured-deck-publisher-name">{featuredDeckPublisherName}</p>
                </div>
                <div className="banner-right">
                  <img src={featuredeckimg} alt="Featured Deck"></img>
                </div>
              </div>
            </div>

            <div className="home-boxes">
              <div className="left-box">
                <div className="news-box">
                  <Link to="/blogs/news">
                    <div className="news-box-contents">
                      <p>News</p>
                      <img src={bobafett} alt="News" />
                    </div>
                  </Link>
                </div>
                <div className="blogs-box">
                  <Link to="/blogs">
                    <div className="blogs-box-contents">
                      <img src={chewbacca} alt="Blogs" />
                      <p>Blogs</p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="right-box">
                <div className="collection-box">
                  <Link to="/collection">
                    <div className="collection-box-contents">
                      <p>Collection</p>
                      <img src={darthvader} alt="Collection" />
                    </div>
                  </Link>
                </div>
                <div className="all-cards-box">
                  <Link to="/allcards">
                    <div className="all-cards-box-contents">
                      <img src={trooper} alt="all-cards" />
                      <p>Explore Cards</p>
                    </div>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        <Footer />
      </div>
    );
  }
  
  export default Home;
