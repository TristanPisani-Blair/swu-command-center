const express = require('express');
const router = express.Router;
const schemas = require('../models (Mongoose)/Blog');

router.get('/blogs', async (req, res) => {
    const blogs = schemas.Blog;

    try {
        const allBlogs = await blogs.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/blogdata', async (req, res) => {
    const { 
        id, 
        title, 
        content, 
        author, 
        date, 
        commentCount, 
        comments, 
        isNews } = req.body;

    const blogData = {
        id: id,
        title: title,
        content: content,
        author: author,
        date: date,
        commentCount: commentCount,
        comments: comments,
        isNews: isNews
    }

    const blog = new schemas.Blog(blogData);
    const newBlog = await blog.save();

    if (newBlog) {
        console.log('Blog saved.');
    }

    res.end();
});

module.exports = router;