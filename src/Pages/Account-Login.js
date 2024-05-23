import React from "react";
import './Account-Login.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';


const Login = () => {
    return (
      <div>
        <Navbar />

            <div className="container" class="wrapper">
              <div className="login-header">
                <h1>Login</h1>
                <div>
                  <hr className="divider" />
                </div>
                </div>

                <div className="container-2">
                  <div className="form-group">
                    <input type="username" id="username" placeholder="Username" />
                  </div>
                  <div className="form-group">
                    <input type="password" id="password" placeholder="Password" />
                  </div>
                  <div className="form-group-checkbox">
                    <input type="checkbox" id="stay-logged-in" name="stay-logged-in" />
                    <label htmlFor="stay-logged-in">Stay logged in</label>
                  </div>
                  <div>
                    <button className="login-button">Login</button>
                  </div>
                  <div className="sign-up-link">
                    <a href="/signup">Don't have an account? Sign up here!</a>
                  </div>
              </div>
              
            </div>

        <Footer />
      </div>
    );
  }
  
  export default Login;
