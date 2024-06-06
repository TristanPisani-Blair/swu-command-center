import React from 'react';
import { Link } from 'react-router-dom';

const BlogList = (props) => {
    const blogs = props.blogs;

    return (
        <div className='blog-list'>
            {blogs.map((blog) => (
                <div className="blog-post" key={blog.id}>
                    <Link to={{
                        pathname: `/blog/${encodeURIComponent(blog.publisher)}/${encodeURIComponent(blog.title)}`,
                        state: { blog: blog },
                    }} className="blog-link">
                        <div className="blog-post" key={blog.id}>
                            <div className="blog-post-top">
                                <h2 className="blog-title">{blog.title}</h2>
                                <h2 className="blog-date">{blog.date}</h2>
                            </div>
                            <div className="blog-body">
                                <p>{blog.content}</p>
                            </div>
                            <div className="blog-post-bottom">
                                <p className="blog-publisher">{blog.publisher}</p>
                                <p> - </p>
                                <p className="blog-comments">{blog.comments} comments</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default BlogList;