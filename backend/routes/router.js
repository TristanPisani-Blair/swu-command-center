const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas');

/////////////////
//             //
// User Routes //
//             //
/////////////////

// Check if user exists
router.get('/check-users', async (req, res) =>{
  const { email } = req.query;
    const user = await schemas.Users.findOne({ email });
    res.json({ exists: !!user });
});

// Check if a username already exists
router.get('/check-username', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await schemas.Users.findOne({ username });
    if (user) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create username
router.post('/create-username', async (req, res) => {
    const { email, username } = req.body;
    const newUser = new schemas.Users({ email, username });
    await newUser.save();
    res.status(201).send('User saved.');
});

// Fetch username based on logged-in user's email
router.get('/get-username', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await schemas.Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ username: user.username }); // Respond with the username found
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/////////////////
//             //
// Blog Routes //
//             //
/////////////////

// Fetch all blogs
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

    // Check if the blog exists
    const blog = await schemas.Blogs.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Create a new comment
    const newComment = new schemas.Comments({
      blogID: blogId,
      author,
      content,
      date: new Date()
    });

    await newComment.save();

    // Update the blog post with the new comment using $push
    await schemas.Blogs.updateOne(
      { _id: blogId },
      {
        $push: { comments: newComment },
        $inc: { commentCount: 1 }
      }
    );

    const updatedBlog = await schemas.Blogs.findById(blogId).populate('comments').exec();

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

module.exports = router;