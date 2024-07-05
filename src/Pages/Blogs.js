import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './Blogs.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import BlogList from "./BlogList";

const Blogs = () => {
  const [showModal, setShowModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch blog data from the database
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Fetch blog data from the database on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSort = (option) => {
    console.log('Sorting by:', option);

    // Create a copy of the original data
    const sortedBlogs = [...blogs];

    // Sort the blogs array based on the selected option
    if (option === 'newest') {
      sortedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest date
    } else if (option === 'oldest') {
      sortedBlogs.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by oldest date
    } else if (option === 'mostPopular') {
      sortedBlogs.sort((a, b) => b.commentCount - a.commentCount); // Sort by most comments
    }

    setBlogs(() => [...sortedBlogs]);
  };

  // Function to handle filtering of blogs
  const handleFilter = async (filter) => {
    try {
      let filteredBlogs = [];

      if (filter === 'news') {
        const response = await axios.get('http://localhost:4000/blogs');
        filteredBlogs = response.data.filter(blog => blog.isNews === true);
      } else if (filter === 'allBlogs') {
        const response = await axios.get('http://localhost:4000/blogs');
        filteredBlogs = response.data;
      } else if (filter === 'myBlogs' && isAuthenticated) {
        const response = await axios.get('http://localhost:4000/blogs');
        filteredBlogs = response.data.filter(blog => blog.author === user?.nickname);
      }

      setBlogs([...filteredBlogs]);
    } catch (error) {
      console.error('Error filtering blogs:', error);
    }
  };

  const handleFilterClick = (filter) => {
    navigate(`?filter=${filter}`);
    handleFilter(filter);
  };

  const handleNewBlogPostClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBlogTitle('');
    setBlogContent('');
    setError('');
  };

  const handleSaveBlogPost = async (e) => {
    e.preventDefault();

    // Get the current date and time
    const currentDate = new Date();
    const dateTime = currentDate.toLocaleString();

    // Grab logged in users username
    if (!isAuthenticated) {
      setError(<p>You must be logged in to post a blog.</p>);
      return;
    }

    // Check if title or post are empty, show error if true
    if (!blogTitle || !blogContent) {
      setError(<p className="post-required">Title or post cannot be empty.</p>);
      return;
    } else {
      setError('');
    }

    // Create the new blog post object
    const newBlogPost = {
      title: blogTitle,
      content: blogContent,
      date: dateTime,
      author: user.nickname,
      commentCount: 0,
      comments: [],
      isNews: false
    };

    console.log("New Blog Post:", newBlogPost);

    try {
      // Send the new blog post to the server
      const response = await axios.post('http://localhost:4000/blogs', newBlogPost);
      console.log("Response from server:", response.data);

      // Add the new blog post to the state
      setBlogs([...blogs, response.data]);

      handleCloseModal();
    } catch (error) {
      console.error("There was an error saving the blog post.", error);
      setError("There was an error saving the blog post.");
    }
  };

    return (
      <div>
        <Navbar />
        <div className="container" class="wrapper">
          <div className="blogs-leftNav">
            <ul>
              <li><a href="#AllBlogs" onClick={() => handleFilterClick('allBlogs')}>All Blogs</a></li>
              <li><a href="#News" onClick={() => handleFilterClick('news')}>News</a></li>
              <li><a href="#MyBlogs" onClick={() => handleFilterClick('myBlogs')}>My Blogs</a></li>
              <li><a href="#" onClick={handleNewBlogPostClick}>New Blog Post</a></li>
            </ul>
          </div>
          
          <div className="blogs-body">
            <h1>Blogs</h1>
            <div>
              <hr className="divider" />
            </div>
            <BlogList blogs={blogs} />
          </div>

          <div className="blogs-rightNav">
            <ul>
              <p>Sort</p>
              <li><a href="#Newest" onClick={() => handleSort('newest')}>Newest</a></li>
              <li><a href="#Oldest" onClick={() => handleSort('oldest')}>Oldest</a></li>
              <li><a href="#MostPopular" onClick={() => handleSort('mostPopular')}>Most Popular</a></li>
            </ul>
          </div>
        </div>

        {showModal && (
          <div className="blogModal">
            <div className="blog-modal-content">
              <span className="close-button" onClick={handleCloseModal}>&times;</span>
              <h2>New Blog Post</h2>
              <form>
                <label htmlFor="blog-title">Title</label>
                <input
                  type="text"
                  id="blog-title"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                />
                <label htmlFor="blog-content">Blog Post</label>
                <textarea
                  id="blog-content"
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}>
                </textarea>

                {error && <p className="error-message">{error}</p>}

                <button type="button" onClick={handleSaveBlogPost}>Save</button>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    );
  }
  
  export default Blogs;
