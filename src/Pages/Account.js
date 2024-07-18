import React, { useState, useEffect  } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './Account.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const Account = () => {
  const { user, isAuthenticated } = useAuth0();
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [publicDecks, setPublicDecks] = useState(true);
  const [publicBlogs, setPublicBlogs] = useState(true);
  const [commentsOnDecks, setCommentsOnDecks] = useState(true);
  const [commentsOnBlogs, setCommentsOnBlogs] = useState(true);
  const [usernameError, setUsernameError] = useState('');
  const [refreshNavbar, setRefreshNavbar] = useState(false);

  const { logout } = useAuth0();

  // Fetch username and user settings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isAuthenticated && user) {
          const usernameResponse = await axios.get('http://localhost:4000/get-username', {
            params: { email: user.email }
          });
          setUsername(usernameResponse.data.username);

          const settingsResponse = await axios.get('http://localhost:4000/user-settings', {
            params: { email: user.email }
          });
          setPublicDecks(settingsResponse.data.publicDecks);
          setPublicBlogs(settingsResponse.data.publicBlogs);
          setCommentsOnDecks(settingsResponse.data.commentsOnDecks);
          setCommentsOnBlogs(settingsResponse.data.commentsOnBlogs);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  const handleChangeUsername = async () => {
    try {
      const response = await axios.patch('http://localhost:4000/update-username', {
        email: user.email,
        newUsername: newUsername
      });
      
      if (response.status === 200) {
        console.log(response.data.message);
        handleCloseUsernameModal();

        // Update each blog's author to the new username
        await axios.patch('http://localhost:4000/update-blog-author', {
          prevUsername: username,
          newUsername: newUsername
        });

        // Trigger Navbar refresh
        setRefreshNavbar(prev => !prev);

      } else {
        setError(`Error: ${response.data.error}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setUsernameError(`${error.response.data.error}`);
      } else {
        console.error('Error updating username:', error);
        setError('Failed to update username. Please try again.');
      }
    }
  };

  const handleCloseUsernameModal = () => {
    setShowUsernameModal(false);
    setNewUsername('');
    setUsernameError('');
  };

  const handleShowCreditsModal = () => {
    setShowCreditsModal(true);
  };

  const handleCloseCreditsModal = () => {
    setShowCreditsModal(false);
  };

  const updateUserSettings = async (updates) => {
    try {
      if (isAuthenticated) {
        await axios.patch('http://localhost:4000/update-user-settings', {
          username: username,
          updates
        });
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
      setError('Failed to update user settings.');
    }
  };

  const handlePublicDecksChange = () => {
    const newValue = !publicDecks;
    setPublicDecks(newValue);
    updateUserSettings({ publicDecks: newValue });
  };

  const handlePublicBlogsChange = async () => {
    const newValue = !publicBlogs;
    setPublicBlogs(newValue);
    updateUserSettings({ publicBlogs: newValue });

    try {
      await axios.patch('http://localhost:4000/update-public-blogs', {
          username,
          isPublic: newValue
      });
    } catch (error) {
        console.error('Error updating blog settings:', error);
        setError('Failed to update blog settings.');
    }
  };

  const handleCommentsOnDecksChange = () => {
    const newValue = !commentsOnDecks;
    setCommentsOnDecks(newValue);
    updateUserSettings({ commentsOnDecks: newValue });
  };

  const handleCommentsOnBlogsChange = async () => {
    const newValue = !commentsOnBlogs;
    setCommentsOnBlogs(newValue);
    updateUserSettings({ commentsOnBlogs: newValue });

    try {
      await axios.patch('http://localhost:4000/update-public-blog-comments', {
          username,
          allowComments: newValue
      });
    } catch (error) {
        console.error('Error updating blog settings:', error);
        setError('Failed to update blog settings.');
    }
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
                    <input type="checkbox" checked={publicDecks} onChange={handlePublicDecksChange} />
                    <span className="slider"></span>
                  </label>
              </div>

              <div className="setting-item">
                <p>Public blogs</p>
                  <label className="switch">
                    <input type="checkbox" checked={publicBlogs} onChange={handlePublicBlogsChange} />
                    <span className="slider"></span>
                  </label>
              </div>

              <div className="setting-item">
                <p>Allow comments on decks</p>
                  <label className="switch">
                    <input type="checkbox" checked={commentsOnDecks} onChange={handleCommentsOnDecksChange} />
                    <span className="slider"></span>
                  </label>
              </div>

              <div className="setting-item">
                <p>Allow comments on blogs</p>
                  <label className="switch">
                    <input type="checkbox" checked={commentsOnBlogs} onChange={handleCommentsOnBlogsChange} />
                    <span className="slider"></span>
                  </label>
              </div>
            </div>

            <div className="credits">
              <h1 onClick={handleShowCreditsModal} style={{ cursor: 'pointer' }}>Credits</h1>
            </div>

            <div className="account-actions">
              <button className="delete-account">Delete Account</button>
              <button className="logout" onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
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
            <div className="username-error">
              {usernameError && <p className="error-message">{usernameError}</p>}
            </div>
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
              <h2>Credits</h2>
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
