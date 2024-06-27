import React from 'react';
import './App.css';
import Home from './Pages/Home';
import HowToPlay from './Pages/HowToPlay';
import Collection from './Pages/Collection';
import Blogs from './Pages/Blogs';
import Account from './Pages/Account';
import LoginPage from './Pages/Account-Login';
import SignupPage from './Pages/Account-Signup';
import AllCards from './Pages/AllCards';
import BuildADeck from './Pages/BuildADeck';
import CardList from './Pages/CardList';
import DeckPage from './Pages/DeckPage';
import MyDecks from './Pages/MyDecks';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cardlist" element={<CardList />} />
          <Route path="/all-cards" element={<AllCards />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/build-a-deck/:deckId" element={<BuildADeck />} />
          <Route path="/my-decks" element={<MyDecks />} />
          <Route path="/deck/:deckId" element={<DeckPage />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
