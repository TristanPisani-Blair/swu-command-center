import React, { useState } from "react";
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

          </div>
        <Footer />
      </div>
    );
  }
  
  export default Home;
