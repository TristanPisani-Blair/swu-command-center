import React from 'react';
import { Link } from 'react-router-dom';

const BlogList = (props) => {
    const blogs = props.blogs;

    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    const handleClick = (blog) => {
        console.log("Clicked blog:", blog);
    };

    return (
        <div className='blog-list'>
            {blogs.map((blog) => (
                <div className="blog-post" key={blog.id}>
                    <Link to={{
                        pathname: `/blog/${encodeURIComponent(blog.author)}/${encodeURIComponent(blog.title)}`,
                        state: { blog: blog },
                    }} className="blog-link"
                    onClick={() => handleClick(blog)}>
                        <div className="blog-post" key={blog.id}>
                            <div className="blog-post-top">
                                <h2 className="blog-title">{blog.title}</h2>
                                <h2 className="blog-date">{formatDate(blog.date)}</h2>
                            </div>
                            <div className="blog-body">
                                <p>{blog.content}</p>
                            </div>
                            <div className="blog-post-bottom">
                                <p className="blog-author">{blog.author}</p>
                                <span className="blog-separator"> - </span>
                                <p className="blog-comments">{blog.commentCount} comments</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default BlogList;