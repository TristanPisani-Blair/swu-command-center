import React from 'react';
import './App.css';
import Home from './Pages/Home';
import HowToPlay from './Pages/HowToPlay';
import Collection from './Pages/Collection';
import Blogs from './Pages/Blogs';
import BlogPage from './Pages/BlogPage';
import Account from './Pages/Account';
import LoginPage from './Pages/Account-Login';
import SignupPage from './Pages/Account-Signup';
import AllCards from './Pages/AllCards';
import BuildADeck from './Pages/Build-A-Deck';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // URL router

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/how-to-play" element={<HowToPlay/>} />
        <Route path="/collection" element={<Collection/>} />
        <Route path="/blogs" element={<Blogs/>} />
        <Route path="/blog/:publisher/:title" element={<BlogPage/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/all-cards" element={<AllCards />} />
        <Route path="/build-a-deck" element={<BuildADeck />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;