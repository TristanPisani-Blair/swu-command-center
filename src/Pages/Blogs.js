import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './Blogs.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import BlogList from "./BlogList";
import addPostBTN from "../Components/Assets/add-post.png";

const Blogs = () => {
  const [showModal, setShowModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
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

  // Fetch blog data from the database
  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/public-blogs');
      let fetchedBlogs = response.data;

      // Filter out private blogs
      fetchedBlogs = fetchedBlogs.filter(blog => blog.isPublic);

      return fetchedBlogs;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
      return [];
    }
  }, []);

  const handleSort = (option, blogsToSort) => {
    // Create a copy of the original data
    let sortedBlogs = [...blogsToSort];

    // Sort the blogs array based on the selected option
    if (option === 'newest') {
      sortedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest date
    } else if (option === 'oldest') {
      sortedBlogs.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by oldest date
    } else if (option === 'mostPopular') {
      sortedBlogs.sort((a, b) => b.commentCount - a.commentCount); // Sort by most comments
    }

    return sortedBlogs;
  };

  // Function to handle filtering of blogs
  const handleFilter = async (filter) => {
    setLoading(true);

    try {
      let filteredBlogs = [];

      if (filter === 'news') {
        const response = await axios.get('http://localhost:4000/public-blogs');
        filteredBlogs = response.data.filter(blog => blog.isNews === true);
      } else if (filter === 'allBlogs') {
        const response = await axios.get('http://localhost:4000/public-blogs');
        filteredBlogs = response.data;
      } else if (filter === 'myBlogs' && isAuthenticated) {
        const response = await axios.get('http://localhost:4000/get-blogs-by-author', {
          params: { author: username }
        });
        filteredBlogs = response.data;
      }

      const sortedBlogs = handleSort(sortBy, filteredBlogs);
      setBlogs(sortedBlogs);
      setLoading(false);
    } catch (error) {
      console.error('Error filtering blogs:', error);
      setLoading(false);
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
      author: username,
      commentCount: 0,
      comments: [],
      isNews: username === 'CommandCenterDev',
      isPublic,
      allowComments
    };

    console.log("New Blog Post:", newBlogPost);

    try {
      // Send the new blog post to the server
      const response = await axios.post('http://localhost:4000/blogs', newBlogPost);
      console.log("Response from server:", response.data);

      // Add the new blog post to the state
      setBlogs([...blogs, response.data]);

      handleCloseModal();

      // Re-fetch the blogs and filter out private blogs
      let fetchedBlogs = await fetchBlogs();
      fetchedBlogs = fetchedBlogs.filter(blog => blog.isPublic);

      // Update the state with the new list of blogs
      const sortedBlogs = handleSort(sortBy, fetchedBlogs);
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error("There was an error saving the blog post.", error);
      setError("There was an error saving the blog post.");
    }
  };

  // Fetch blog data from the database on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filter = queryParams.get('filter');

    const initializeBlogs = async () => {
      setLoading(true);

      let fetchedBlogs = await fetchBlogs();

      if (filter) {
        await handleFilter(filter);
      } else {
        const sortedBlogs = handleSort(sortBy, fetchedBlogs);
        setBlogs(sortedBlogs);
      }

      setLoading(false);
    };

    initializeBlogs();
  }, [location.search]);

    return (
      <div>
        <Navbar />
        <div className="container" class="blogs-wrapper">
          <div className="blogs-leftNav">
            <ul>
              <li><a onClick={() => handleFilterClick('allBlogs')}>All Blogs</a></li>
              <li><a onClick={() => handleFilterClick('news')}>News</a></li>
              <li><a onClick={() => handleFilterClick('myBlogs')}>My Blogs</a></li>
              <li><a href="#" onClick={handleNewBlogPostClick}>New Blog Post</a></li>
            </ul>
          </div>
          
          <div className="blogs-body">
            <div className="blogs-header">
              <h1>Blogs</h1>
              <img src={addPostBTN} alt="Add Post" onClick={handleNewBlogPostClick} className="add-post-button"/>            </div>
            <div>
              <hr className="divider" />
            </div>
            {!loading && (
              <BlogList blogs={blogs} />
            )}
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

                <div className="blog-options">
                  <div className="option-item">
                    <p>Public Blog</p>
                    <label htmlFor="is-public" className="blogs-switch">
                      <input
                        type="checkbox"
                        id="is-public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <span className="blogs-slider"></span>
                    </label>
                  </div>

                  <div className="option-item">
                  <p>Allow Comments</p>
                    <label htmlFor="allow-comments" className="blogs-switch">
                      <input
                        type="checkbox"
                        id="allow-comments"
                        checked={allowComments}
                        onChange={(e) => setAllowComments(e.target.checked)}
                      />
                      <span className="blogs-slider"></span>
                    </label>
                  </div>

                </div>

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
