import React from 'react';
import './App.css';
import Home from './Pages/Home';
import HowToPlay from './Pages/HowToPlay';
import Collection from './Pages/Collection';
import Blogs from './Pages/Blogs';
import Account from './Pages/Account';
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
        <Route path="/account" element={<Account/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;