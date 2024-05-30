import React from "react";
import './Blogs.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';


const Blogs = () => {
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
              <li><a href="#NewBlogPost">New Blog Post</a></li>
            </ul>
          </div>

          <div className="blogs-body">
            <h1>Blogs</h1>
            <div>
              <hr className="divider" />
            </div>
            <div className="blog-post">
              <div className="blog-post-top">
                <h2 className="blog-title">Blog Title</h2>
                <h2 className="blog-date">Date</h2>
              </div>
              <div className="blog-body">
                <p>This is a blog post.</p>
              </div>
              <div className="blog-post-bottom">
                <p className="blog-publisher">Publisher</p>
                <p> - </p>
                <p className="blog-comments">0 comments</p>
              </div>
            </div>
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

        <Footer />
      </div>
    );
  }
  
  export default Blogs;
