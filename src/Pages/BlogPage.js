import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import './BlogPage.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import axios from 'axios';
import editBTN from '../Components/Assets/edit-button.png';

const BlogPage = () => {
  const { author, title } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();


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

  const handleNewBlogPostClick = () => {
    setShowModal(true);
  };

  const handleCloseNewBlogModal = () => {
    setShowModal(false);
    setBlogTitle("");
    setBlogContent("");
    setError("");
  };

  const handleSaveBlogPost = (e) => {
    e.preventDefault();

    // Get the current date and time
    const currentDate = new Date();
    const dateTime = currentDate.toLocaleString();

    // Log the date and time along with the blog title and content
    console.log("Date and Time:", dateTime);
    console.log("Title:", blogTitle);
    console.log("Content:", blogContent);

    handleCloseNewBlogModal();
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const handleEditClick = () => {
    setModalTitle(blogPost.title);
    setModalContent(blogPost.content);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedBlogPost = { title: modalTitle, content: modalContent };
      const response = await axios.patch(`http://localhost:4000/blogs/${blogPost._id}`, updatedBlogPost);
      if (response.status === 200) {
        setBlogPost(response.data);
        setShowModal(false);
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
        <div className="container" class="wrapper">
          <div className="blog-page-leftNav">
            <ul>
              <li><a href="/blogs?filter=allBlogs">All Blogs</a></li>
              <li><a href="/blogs?filter=news">News</a></li>
              <li><a href="/blogs?filter=myBlogs">My Blogs</a></li>
              <li><a href="#" onClick={handleNewBlogPostClick}>New Blog Post</a></li>
            </ul>
          </div>

          <div className="blog-page-body">
            <div className="blog-page-header">
              <h1>{blogPost.title}</h1>
              {user.name === blogPost.author && (
                <img src={editBTN} alt="Edit" onClick={handleEditClick} className="edit-button"/>
              )}
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
          </div>
        </div>

        {showModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
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

        <Footer />
      </div>
    );
  }
  
  export default BlogPage;
