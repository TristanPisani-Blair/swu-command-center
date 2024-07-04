import React, { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './Account.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const Account = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const [publicDecks, setPublicDecks] = useState(false);
  const [publicBlogs, setPublicBlogs] = useState(false);
  const [commentsOnDecks, setCommentsOnDecks] = useState(false);
  const [commentsOnBlogs, setCommentsOnBlogs] = useState(false);

  const handleChangeUsername = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.patch('/api/update-username', {
        userId: user.sub,
        newUsername,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the user object locally if needed
      // Logic to update local user object here

      // Close the modal
      setShowUsernameModal(false);
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleCloseUsernameModal = () => {
    setShowUsernameModal(false);
    setNewUsername('');
  };

  const handleShowCreditsModal = () => {
    setShowCreditsModal(true);
  };

  const handleCloseCreditsModal = () => {
    setShowCreditsModal(false);
  };

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
              <p onClick={() => setShowUsernameModal(true)}>Change Username</p>
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

            <div className="attributes">
              <h1 onClick={handleShowCreditsModal} style={{ cursor: 'pointer' }}>Attributes</h1>
            </div>

            <div className="account-actions">
              <button className="delete-account">Delete Account</button>
              <button className="logout">Logout</button>
            </div>

          </div>  
        </div>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="username-modal">
          <div className="username-modal-content">
            <div className="username-modal-header">
              <h2>Change Username</h2>
              <span className="username-close-button" onClick={handleCloseUsernameModal}>&times;</span>
            </div>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              className="username-input"
            />
            <div className="submit-button-container">
              <button onClick={handleChangeUsername} className="submit-button">Submit</button>
            </div>          
          </div>
        </div>
      )}

      {/* Credits Modal */}
      {showCreditsModal && (
        <div className="credits-modal">
          <div className="credits-modal-content">
            <div className="credits-modal-header">
              <h2>Attributes</h2>
              <span className="credits-close-button" onClick={handleCloseCreditsModal}>&times;</span>
            </div>
            <ul>
              <li>
                <a href="https://www.flaticon.com/free-icons/arrow" title="arrow icons">Arrow icons created by Freepik - Flaticon</a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-icons/edit" title="edit icons">Edit icons created by Kiranshastry - Flaticon</a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-icons/message" title="message icons">Message icons created by SeyfDesigner - Flaticon</a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-icons/account" title="account icons">Account icons created by Shashank Singh - Flaticon</a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-icons/ui" title="ui icons">Ui icons created by meaicon - Flaticon</a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-icons/enter" title="enter icons">Enter icons created by Cap Cool - Flaticon</a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-icons/down-arrow" title="down arrow icons">Down arrow icons created by feen - Flaticon</a>
              </li>
            </ul>
          </div>
        </div>
      )}

        <Footer />
      </div>
    );
  }
  
  export default Account;
