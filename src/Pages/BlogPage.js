import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import './BlogPage.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import axios from 'axios';
import editBTN from '../Components/Assets/edit-button.png';
import addComment from '../Components/Assets/message.png';
import shareBTN from '../Components/Assets/share.png';

const BlogPage = () => {
  const { author, title } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth0();
  const [username, setUsername] = useState('');
  const [userSettings, setUserSettings] = useState({});
  const navigate = useNavigate();

  // Fetch username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (isAuthenticated && user) {
          const response = await axios.get('http://localhost:4000/get-username', {
            params: { email: user.email }
          });
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [isAuthenticated, user]);

  // Fetch user settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/user-settings');
        setUserSettings(response.data);
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserSettings();
  }, []);

  // Fetch blog data from the database
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const encodedAuthor = encodeURIComponent(author);
        const encodedTitle = encodeURIComponent(title);
        const response = await axios.get(`http://localhost:4000/blogs/${encodedAuthor}/${encodedTitle}`);
        setBlogPost(response.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      };
    }

    fetchBlogPost();
  }, [author, title]);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setBlogTitle("");
    setBlogContent("");
    setError("");
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setNewComment("");
    setError("");
  }

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const handleEditClick = () => {
    setModalTitle(blogPost.title);
    setModalContent(blogPost.content);
    setShowEditModal(true);
  };

  const copyToClipboard = () => {
    // Show alert for link copied
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const alertMessage = document.createElement('div');
    alertMessage.textContent = 'Link copied to clipboard!';
    alertMessage.classList.add('alert-message');
    document.body.appendChild(alertMessage);

    // Remove alert after 2 seconds
    setTimeout(() => {
      alertMessage.remove();
    }, 2000);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    // Get the current date and time
    const currentDate = new Date();
    const dateTime = currentDate.toLocaleString();

    // Grab logged in users username
    if (!isAuthenticated) {
      setError(<p>You must be logged in to post a comment.</p>);
      return;
    }

    // Check if title or post are empty, show error if true
    if (!newComment) {
      setError(<p className="comment-required">Comment cannot be empty.</p>);
      return;
    } else {
      setError('');
    }

    const comment = {
      author: username,
      content: newComment,
      date: new Date().toISOString(),
    };

    console.log("New Comment:", comment);

    try {
      const response = await axios.post(`http://localhost:4000/blogs/${blogPost._id}/comments`, comment);
      if (response.status === 200) {
        setBlogPost(response.data);
        setShowCommentModal(false);
      } else {
        setError(`Error adding comment: ${response.statusText}`);
      }
    } catch (error) {
      console.error("There was an error adding the comment.", error);
      setError("There was an error adding the comment.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedBlogPost = { title: modalTitle, content: modalContent };
      const response = await axios.patch(`http://localhost:4000/blogs/${blogPost._id}`, updatedBlogPost);
      if (response.status === 200) {
        setBlogPost(response.data);
        setShowEditModal(false);
      } else {
        setError(`Error updating blog post: ${response.statusText}`);
      }
    } catch (error) {
      console.error("There was an error updating the blog post.", error);
      setError("There was an error updating the blog post.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/blogs/${blogPost._id}`);
      navigate('/blogs');
    } catch (error) {
      console.error("There was an error deleting the blog post.", error);
      setError("There was an error deleting the blog post.");
    }
  };

  if (!isAuthenticated) {
    return <p>User not logged in.</p>;
  }

  if (!blogPost) {
    return <p>Loading...</p>;
  }

    return (
      <div>
        <Navbar />
        <div className="container" class="blogpage-wrapper">
          <div className="blog-page-leftNav">
            <ul>
              <li><a href="/blogs">All Blogs</a></li>
              <li><a href="/blogs?filter=news">News</a></li>
              <li><a href="/blogs?filter=myBlogs">My Blogs</a></li>
            </ul>
          </div>

          <div className="blog-page-body">
            <div className="blog-page-header">
              <h1>{blogPost.title}</h1>
              <div className="blog-header-buttons">
                <img src={shareBTN} alt="Share" onClick={copyToClipboard} className="copy-button"/>
                {username === blogPost.author && (
                  <img src={editBTN} alt="Edit" onClick={handleEditClick} className="edit-button"/>
                )}
              </div>
            </div>
            <div>
              <hr className="divider" />
            </div>
            <div className="blog-page-info">
              <p>{blogPost.author}</p>
              <p>{formatDate(blogPost.date)}</p>
            </div>
            <div className="blog-page-content">
              <p>{blogPost.content}</p>
            </div>

          <div className="blog-page-comments">
            <div className="comments-header">
              <h1>Comments</h1>
              {blogPost.allowComments && (
              <img src={addComment} alt="Add Comment" onClick={() => setShowCommentModal(true)} className="add-comment-button" />
            )}          
            </div>
            <div>
              <hr className="divider" />
            </div>
            <div className="comments">
              {blogPost.allowComments && blogPost.comments.length > 0 ? (
                blogPost.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-header">
                      <h2>{comment.author}</h2>
                      <h2>{new Date(comment.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))
              ) : (
                null // Render nothing if no comments
              )}

              {!blogPost.allowComments && (
              <p>User has disabled comments.</p>
              )}
              {blogPost.allowComments && blogPost.comments.length === 0 && (
                <p>No comments yet.</p>
              )}
            </div>
          </div>

          </div>
        </div>

        {showEditModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <span className="close" onClick={handleCloseEditModal}>&times;</span>
            <h2>Edit Blog Post</h2>
            <label htmlFor="edit-title">Title:</label>
            <input id="edit-title" type="text" value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} />
            <label htmlFor="edit-content">Content:</label>
            <textarea id="edit-content" value={modalContent} onChange={(e) => setModalContent(e.target.value)} />
            
            {error && <p className="error-message">{error}</p>}

            <div className="edit-modal-buttons">
              <button className="save-button" onClick={handleSaveChanges}>Save</button>
              <button className="delete-button" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
        )}

        {showCommentModal && (
        <div className="comment-modal">
          <div className="comment-modal-content">
            <span className="close" onClick={handleCloseCommentModal}>&times;</span>
            <h2>Add Comment</h2>
            <textarea
              id="new-comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment" />
            {error && <p className="error-message">{error}</p>}
            <div classname="comment-model-button">
              <button className="submit-button" onClick={handleAddComment}>Submit</button>
            </div>
          </div>
        </div>
        )}

        <Footer />
      </div>
    );
  }
  
  export default BlogPage;
