import React from 'react';
import './App.css';
import Home from './Pages/Home';
import HowToPlay from './Pages/HowToPlay';
import Collection from './Pages/Collection';
import Blogs from './Pages/Blogs';
import BlogPage from './Pages/BlogPage';
import Account from './Pages/Account';
/* import Navbar from './Components/Navbar'; */
import CardDatabase from './Pages/CardDatabase';
import CardList from './Pages/CardList';
import CardPage from './Pages/CardPage';
import DeckPage from './Pages/DeckPage';
import MyDecks from './Pages/MyDecks';
import BuildADeck from './Pages/BuildADeck';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
  <BrowserRouter>
    <div>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/how-to-play" element={<HowToPlay/>} />
      <Route path="/collection" element={<Collection/>} />
      <Route path="/blogs" element={<Blogs/>} />
      <Route path="/blog/:author/:title" element={<BlogPage/>} />
      <Route path="/account" element={<Account/>} />
      <Route path="/all-cards" element={<CardList/>} />
      <Route path="/card-database" element={<CardDatabase />} />
      <Route path="/card-list" element={<CardList />} />
      <Route path="/card/:number/:name" element={<CardPage/>} />
      <Route path="/build-a-deck" element={<BuildADeck />} />
      <Route path="/build-a-deck/:deckId" element={<BuildADeck />} />
      <Route path="/test" element={<test/>}/>
      <Route path="/my-decks" element={<MyDecks />} />
      <Route path="/deck/:deckId" element={<DeckPage />} />
    </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
