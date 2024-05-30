import React from 'react';
import './App.css';
import Home from './Pages/Home';
import HowToPlay from './Pages/HowToPlay';
import Collection from './Pages/Collection';
import Blogs from './Pages/Blogs';
import Account from './Pages/Account';
/* import Navbar from './Components/Navbar'; */
import { useAuth0 } from '@auth0/auth0-react';
import { Route, Routes } from 'react-router-dom'; // URL router

function App() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/how-to-play" element={<HowToPlay/>} />
      <Route path="/collection" element={<Collection/>} />
      <Route path="/blogs" element={<Blogs/>} />
      <Route path="/account" element={<Account/>} />
    </Routes>
      {/* Test Buttons */}
      <div>
        <button onClick={() => loginWithRedirect()}>Test Login</button>
        <button onClick={() => logout({ returnTo: window.location.origin })}>Test Logout</button>
      </div>
    </div>
  );
}

export default App;
