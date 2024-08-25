import React, { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
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
  const { user, isAuthenticated } = useAuth0();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    const checkUserInDatabase = async () => {
      try {
        if (isAuthenticated && user) {
          const response = await axios.get('http://localhost:4000/check-users', {
            params: { email: user.email } // Pass email as a query parameter
          });
          
          if (!response.data.exists) {
            setShowUsernameModal(true);
          } else {
            setShowUsernameModal(false);
          }
        }
      } catch (error) {
        console.error('Error checking user in database', error);
      }
    };

    // Only run the check if user is authenticated and user object is available
    if (isAuthenticated && user) {
      checkUserInDatabase();
    }
  }, [isAuthenticated, user]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameError('');

    try {
      // Check if the username already exists
      const checkResponse = await axios.get('http://localhost:4000/check-username', {
        params: { username }
      });

      if (checkResponse.data.exists) {
        setUsernameError('Username already exists. Please choose another one.');
        return;
      }

      // If username doesn't exist, create it
      await axios.post('http://localhost:4000/create-username', { email: user.email, username });
      setShowUsernameModal(false);
      setUsername('');
    } catch (error) {
      console.error('Error creating username', error);
    }
  };

  // Fetch data for featured decks
  const [featuredDeck, setFeaturedDeck] = useState({
    deckName: '',
    userID: '',
    image: ''
  });

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/decks');

        // Check if data is an array and has elements
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Shuffle and select a random deck
          const shuffledDecks = response.data.sort(() => 0.5 - Math.random());
          const randomDeck = shuffledDecks[0]; // Get the first deck after shuffle

          // Get the first card image from the deck
          const firstCard = randomDeck.mainBoard[0] || randomDeck.sideBoard[0];
          const cardImage = firstCard ? firstCard.FrontArt : {featuredeckimg};

          setFeaturedDeck({
            deckName: randomDeck.deckName,
            userID: randomDeck.userID,
            image: randomDeck.cardImage
          });

          console.log('Featured Deck:', {
            deckName: randomDeck.deckName,
            userID: randomDeck.userId,
            image: cardImage
          });
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchDecks();
  }, []);

    return (
      <div>
        <Navbar />
          <div className="home-content">

            <div className="home-banner">
              <div className="banner-contents-background">
                <div className="banner-left">
                  <h2>Featured Decks</h2>
                  <h1 className="featured-deck-name">{featuredDeck.deckName || 'Deck Name'}</h1>
                  <p className="featured-deck-publisher-name">{featuredDeck.publisherName || 'Publisher Name'}</p>
                </div>
                <div className="banner-right">
                  {featuredDeck.image ? (
                    <img src={featuredDeck.image} alt="Featured Deck" />
                  ) : (
                    <img src={featuredeckimg} />
                  )}            
                </div>
              </div>
            </div>

            <div className="home-boxes">
              <div className="left-box">
                <div className="news-box">
                  <Link to="/blogs?filter=news">
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
                      <p>Explore Blogs</p>
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
                  <Link to="/all-cards">
                    <div className="all-cards-box-contents">
                      <img src={trooper} alt="all-cards" />
                      <p>Explore Cards</p>
                    </div>
                  </Link>
                </div>

              </div>
            </div>

          </div>

          {showUsernameModal && (
            <div className="username-modal">
              <div className="username-modal-content">
                <h2>Create a Username</h2>
                  <input
                    type="text"
                    placeholder="Enter a username"
                    className="username-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  {usernameError && <p className="error-message">{usernameError}</p>}
                  <div className="username-submit-button-container">
                    <button onClick={handleUsernameSubmit} className="username-submit-button">Submit</button>
                  </div>   
              </div>
            </div>
          )}
        <Footer />
      </div>
    );
  }
  
  export default Home;
