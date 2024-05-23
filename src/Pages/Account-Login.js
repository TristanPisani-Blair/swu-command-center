import React from "react";
import './Account-Login.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';


const Login = () => {
    return (
      <div>
        <Navbar />

            <div class="wrapper">
                <h1>Login</h1>
            </div>
            <div>
                <hr className="divider" />
            </div>
            <div class="form-box login">
                
            </div>

        <Footer />
      </div>
    );
  }
  
  export default Login;
