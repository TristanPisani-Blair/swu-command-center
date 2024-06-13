import React, { useState } from "react";
import { useParams } from "react-router-dom";
import './BlogPage.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import blogData from './temp-Blog-Data';


const BlogPage = () => {
  const params = useParams();

  const blogPost = blogData.find(blog => 
    blog.publisher === decodeURIComponent(params.publisher) &&
    blog.title === decodeURIComponent(params.title)
  );

  console.log("Blog post data: ", blogPost);

  const [showModal, setShowModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");

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
              <p>{blogPost.publisher}</p>
              <p>{blogPost.date}</p>
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
