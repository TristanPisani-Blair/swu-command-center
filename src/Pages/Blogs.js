import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 
import './Blogs.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import blogData from './temp-Blog-Data';
import BlogList from "./BlogList";

const Blogs = () => {
  const [showModal, setShowModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogs, setBlogs] = useState(blogData);
  const [sortBy, setSortBy] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSort = (option) => {
    const sortedBlogs = [...blogData]; // Create a copy of the original data

    setSortBy(option);
    // Sort the blogs array based on the selected option
    if (option === 'newest') {
        sortedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest date
    } else if (option === 'oldest') {
        sortedBlogs.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by oldest date
    } else if (option === 'mostPopular') {
      sortedBlogs.sort((a, b) => b.comments - a.comments); // Sort by most comments
  }

    setBlogs(sortedBlogs);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filter = queryParams.get('filter');
    
    if (filter === 'news') {
      setBlogs(blogData.filter(blog => blog.isNews));
    } else {
      setBlogs(blogData); // Reset to show all blogs
    }
  }, [location]);

  const handleFilter = (filter) => {
    navigate(`?filter=${filter}`);
  };

  const handleNewBlogPostClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBlogTitle("");
    setBlogContent("");
  };

  const handleSaveBlogPost = () => {
    // Get the current date and time
    const currentDate = new Date();
    const dateTime = currentDate.toLocaleString();

    // Log the date and time along with the blog title and content
    console.log("Date and Time:", dateTime);
    console.log("Title:", blogTitle);
    console.log("Content:", blogContent);

    handleCloseModal();
  };

    return (
      <div>
        <Navbar />
        <div className="container" class="wrapper">
          <div className="blogs-leftNav">
            <ul>
              <li><a href="#News" onClick={() => handleFilter('news')}>News</a></li>
              <li><a href="#NewBlogs">New Blogs</a></li>
              <li><a href="#Trending">Trending</a></li>
              <li><a href="#MyBlogs">My Blogs</a></li>
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
                  onChange={(e) => setBlogContent(e.target.value)}
                ></textarea>
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
