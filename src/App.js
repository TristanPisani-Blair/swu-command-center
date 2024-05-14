import React from 'react';
import './App.css';
import Navbar from '../src/Components/Navbar/Navbar';
import Home from './Pages/Home';
import HowToPlay from './Pages/HowToPlay';
import Collection from './Pages/Collection';
import Blogs from './Pages/Blogs';
import Account from './Pages/Account';
import Footer from '../src/Components/Footer/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // URL router

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/how-to-play" element={<HowToPlay/>} />
        <Route path="/collection" element={<Collection/>} />
        <Route path="/blogs" element={<Blogs/>} />
        <Route path="/account" element={<Account/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;