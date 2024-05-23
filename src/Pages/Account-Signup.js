import React from "react";
import './Account-Signup.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';


const Signup = () => {
    return (
      <div>
        <Navbar />

        <div className="container" class="wrapper">
              <div className="signup-header">
                <h1>Sign Up</h1>
                <div>
                  <hr className="divider" />
                </div>
                </div>

                <div className="container-2">
                <div className="form-group">
                    <input type="email" id="email" placeholder="Email" />
                  </div>
                  <div className="form-group">
                    <input type="username" id="username" placeholder="Username" />
                  </div>
                  <div className="form-group">
                    <input type="password" id="password" placeholder="Password" />
                  </div>
                  <div>
                    <button className="signup-button">Sign Up</button>
                  </div>
                  <div className="login-link">
                    <a href="/login">Already have an account? Log in here!</a>
                  </div>
              </div>
              
            </div>

        <Footer />
      </div>
    );
  }
  
  export default Signup;
