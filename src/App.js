import React from 'react';
import './App.css';
import Home from './Pages/Home';
import HowToPlay from './Pages/HowToPlay';
import Collection from './Pages/Collection';
import Blogs from './Pages/Blogs';
import Account from './Pages/Account';
/* import Navbar from './Components/Navbar'; */
import CardDatabase from './Pages/CardDatabase';
import BuildADeck from './Pages/Build-A-Deck';
import CardList from './Pages/CardList';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // URL router

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
      <Route path="/account" element={<Account/>} />
      <Route path="/cardlist" element={<CardList/>} />
      <Route path="/card-database" element={<CardDatabase/>} />
      <Route path="/card-list" element={<CardList />} />
      <Route path="/build-a-deck" element={<BuildADeck />} />
      <Route path="/test" element={<test/>}/>
    </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
