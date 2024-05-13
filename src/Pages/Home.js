import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from '../Components/Footer/Footer';
//import spacebkgd from '../Assets/hyperspace.jpg';


const Home = () => {
    return (
      <div>
        <Navbar />
        <h1>Welcome to the Home Page</h1>
        <p>This is the content of your home page.</p>
        <Footer />
      </div>
    );
  }
  
  export default Home;
