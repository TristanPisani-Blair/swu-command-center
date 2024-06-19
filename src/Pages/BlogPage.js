import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './BlogPage.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import axios from 'axios';

const BlogPage = () => {
  const { author, title } = useParams();
  const [blogPost, setBlogPost] = useState(null);

  console.log("Blog post data: ", blogPost);

  const [showModal, setShowModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const encodedAuthor = encodeURIComponent(author);
        const encodedTitle = encodeURIComponent(title);
        const response = await axios.get(`http://localhost:4000/blogs/${encodedAuthor}/${encodedTitle}`);
        setBlogPost(response.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };

    fetchBlogPost();
  }, [author, title]);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  if (!blogPost) {
    return <p>Loading...</p>;
  }

  const handleNewBlogPostClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBlogTitle("");
    setBlogContent("");
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

    handleCloseModal();
  };

    return (
      <div>
        <Navbar />
        <div className="container" class="wrapper">
          <div className="blog-page-leftNav">
            <ul>
              <li><a href="#News">News</a></li>
              <li><a href="#NewBlogs">New Blogs</a></li>
              <li><a href="#Trending">Trending</a></li>
              <li><a href="#MyBlogs">My Blogs</a></li>
              <li><a href="#" onClick={handleNewBlogPostClick}>New Blog Post</a></li>
            </ul>
          </div>

          <div className="blog-page-body">
            <div className="blog-page-header">
              <h1>{blogPost.title}</h1>
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

        <Footer />
      </div>
    );
  }
  
  export default BlogPage;
