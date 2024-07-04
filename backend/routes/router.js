const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas');

/////////////////
//             //
// User Routes //
//             //
/////////////////

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


/////////////////
//             //
// Blog Routes //
//             //
/////////////////

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

// Fetch a single blog post by ID
router.get('/blogs/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await schemas.Blogs.findById(blogId).populate('comments').exec();
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Error fetching blog post' });
  }
});

// Update a blog post by ID
router.patch('/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await schemas.Blogs.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedBlog) {
          return res.status(404).send('Blog post not found');
        }
        res.send(updatedBlog);
      } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).send(error);
      }
});

// Delete a blog post by ID
router.delete('/blogs/:id', async (req, res) => {
    try {
        const deletedBlog = await schemas.Blogs.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
          return res.status(404).send('Blog post not found');
        }
         res.send(deletedBlog);
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).send(error);
    }
});

////////////////////
//                //
// Comment Routes //
//                //
////////////////////

// Add a comment to a blog post
router.post('/blogs/:id/comments', async (req, res) => {
  try {
    const blogId = req.params.id;
    const { author, content } = req.body;

    const newComment = new Comment({
      blogID: blogId,
      author,
      content,
      date: new Date()
    });

    await newComment.save();

    // Update the blog post with the new comment
    const blog = await schemas.Blogs.findById(blogId);
    blog.comments.push(newComment);
    blog.commentCount += 1;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

module.exports = router;