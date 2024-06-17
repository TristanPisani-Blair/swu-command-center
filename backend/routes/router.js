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

router.post('/blogs', async(req, res) => {
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

    try {
        const newBlog = new schemas.Blogs(blogData);
        const saveBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('Error saving blog:', error); // Detailed error logging
        res.status(500).json({ error: 'Error saving blog', details: error.message });
    }

    res.end();
})

module.exports = router;