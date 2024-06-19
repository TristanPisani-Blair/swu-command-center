const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas');

router.get('/users', (req, res) =>{
    const userData = {
        "username": "Username",
        "email": "Email@email.com", 
        "password": "Password"
    }

    res.send(userData);
});

router.post('/users', async (req, res) => {
    const { 
        username, 
        email, 
        password } = req.body;

    const userData = {
        username: username,
        email: email,
        password: password
    }

    const newUser = new schemas.Users(userData);
    const saveUser = await newUser.save();

    if (saveUser) {
        res.send('User saved.');
    } else {
        console.log("User not added to database.");
    }

    res.end();
  });

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await schemas.Blogs.find().populate('comments').exec();
        res.status(200).json(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Error fetching blogs', details: error.message });
      }
});

// Fetch a specific blog by author and title
router.get('/blogs/:author/:title', async (req, res) => {
    const { author, title } = req.params;
  
    try {
      const blog = await schemas.Blogs.findOne({ author, title }).populate('comments').exec();
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      res.status(200).json(blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ error: 'Error fetching blog', details: error.message });
    }
});


router.post('/blogs', async(req, res) => {
    const { 
        title, 
        content, 
        author, 
        date, 
        commentCount, 
        comments, 
        isNews } = req.body;

    const blogData = {
        title: title,
        content: content,
        author: author,
        date: date,
        commentCount: commentCount,
        comments: comments,
        isNews: isNews
    }

    try {
        const newBlog = new schemas.Blogs(blogData);
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('Error saving blog:', error);
        res.status(500).json({ error: 'Error saving blog', details: error.message });
    }

    res.end();
});

module.exports = router;