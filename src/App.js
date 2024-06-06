import React from 'react';
import './App.css';
import Home from './Pages/Home';
import HowToPlay from './Pages/HowToPlay';
import Collection from './Pages/Collection';
import Blogs from './Pages/Blogs';
import Account from './Pages/Account';
/* import Navbar from './Components/Navbar'; */
import LoginPage from './Pages/Account-Login';
import SignupPage from './Pages/Account-Signup';
import CardDatabase from './Pages/Card-Database';
import BuildADeck from './Pages/Build-A-Deck';
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
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/card-database" element={<CardDatabase />} />
        <Route path="/build-a-deck" element={<BuildADeck />} />
    </Routes>
      {/* Test Buttons */}
      <div>
        <button onClick={() => loginWithRedirect()}>Test Login</button>
        <button onClick={() => logout({ returnTo: window.location.origin })}>Test Logout</button>
      </div>
    </div>
  </BrowserRouter>
  );
}

export default App;
