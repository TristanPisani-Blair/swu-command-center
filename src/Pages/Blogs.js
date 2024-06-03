import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import './Blogs.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import blogData from './temp-Blog-Data';

const Blogs = () => {
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
              <li><a href="#News">News</a></li>
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
            {blogData.map((post) => (
               <div className="blog-post" key={post.id}>
                <Link to={{
                    pathname: `/blog/${encodeURIComponent(post.publisher)}/${encodeURIComponent(post.title)}`,
                    state: { post }
                  }}
                  className="blog-link">
                  <div className="blog-post-top">
                    <h2 className="blog-title">{post.title}</h2>
                    <h2 className="blog-date">{post.date}</h2>
                  </div>
                  <div className="blog-body">
                    <p>{post.content}</p>
                  </div>
                  <div className="blog-post-bottom">
                    <p className="blog-publisher">{post.publisher}</p>
                    <p> - </p>
                    <p className="blog-comments">{post.comments} comments</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="blogs-rightNav">
            <ul>
              <p>Sort</p>
              <li><a href="#Newest">Newest</a></li>
              <li><a href="#Oldest">Oldest</a></li>
              <li><a href="#MostPopular">Most Popular</a></li>
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
