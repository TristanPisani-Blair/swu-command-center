import React, { useState } from "react";
import './Account.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const Account = () => {
  const [publicDecks, setPublicDecks] = useState(false);
  const [publicBlogs, setPublicBlogs] = useState(false);
  const [commentsOnDecks, setCommentsOnDecks] = useState(false);
  const [commentsOnBlogs, setCommentsOnBlogs] = useState(false);

    return (
      <div>
        <Navbar />

        <div className="container" class="wrapper">
          <div className="account-settings-header">
            <h1>Account Settings</h1>
                  <div>
                    <hr className="divider" />
                  </div>
          </div>

        <div className="container-2">
          <div className="account-settings">
            <div className="account-information">
              <h1>Account Information</h1>
              <p>Change username</p>
              <p>Change password</p>
              <p>Change email address</p>
            </div>

            <div className="share-settings">
              <h1>Share Settings</h1>

              <div className="setting-item">
                <p>Public decks</p>
                  <label  className="switch">
                    <input type="checkbox" checked={publicDecks} onChange={() => setPublicDecks(!publicDecks)} />
                    <span className="slider"></span>
                  </label>
              </div>

              <div className="setting-item">
                <p>Public blogs</p>
                  <label className="switch">
                    <input type="checkbox" checked={publicBlogs} onChange={() => setPublicBlogs(!publicBlogs)} />
                    <span className="slider"></span>
                  </label>
              </div>

              <div className="setting-item">
                <p>Allow comments on decks</p>
                  <label className="switch">
                    <input type="checkbox" checked={commentsOnDecks} onChange={() => setCommentsOnDecks(!commentsOnDecks)} />
                    <span className="slider"></span>
                  </label>
              </div>

              <div className="setting-item">
                <p>Allow comments on blogs</p>
                  <label className="switch">
                    <input type="checkbox" checked={commentsOnBlogs} onChange={() => setCommentsOnBlogs(!commentsOnBlogs)} />
                    <span className="slider"></span>
                  </label>
              </div>
            </div>

            <div className="account-actions">
                    <button className="delete-account">Delete Account</button>
                    <button className="logout">Logout</button>
            </div>

          </div>  
        </div>
      </div>

        <Footer />
      </div>
    );
  }
  
  export default Account;
