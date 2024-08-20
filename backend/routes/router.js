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
    const { email, 
      username,
      publicDecks,
      publicBlogs,
      commentsOnDecks,
      commentsOnBlogs} = req.body;

    const newUser = new schemas.Users({ 
      email, 
      username,
      publicDecks,
      publicBlogs,
      commentsOnDecks,
      commentsOnBlogs });

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

// Update username
router.patch('/update-username', async (req, res) => {
  const { email, newUsername } = req.body;

  try {
    // Check if the new username already exists
    const existingUser = await schemas.Users.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Update the user's username
    const user = await schemas.Users.findOneAndUpdate(
      { email: email },
      { username: newUsername }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Username updated successfully', user });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch user settings
router.get('/user-settings', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await schemas.Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      publicDecks: user.publicDecks,
      publicBlogs: user.publicBlogs,
      commentsOnDecks: user.commentsOnDecks,
      commentsOnBlogs: user.commentsOnBlogs
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user settings
router.patch('/update-user-settings', async (req, res) => {
  const { username, updates } = req.body;

  try {
    // Update user settings
    const userUpdates = {};
    if ('publicDecks' in updates) userUpdates.publicDecks = updates.publicDecks;
    if ('publicBlogs' in updates) userUpdates.publicBlogs = updates.publicBlogs;
    if ('commentsOnDecks' in updates) userUpdates.commentsOnDecks = updates.commentsOnDecks;
    if ('commentsOnBlogs' in updates) userUpdates.commentsOnBlogs = updates.commentsOnBlogs;

    await schemas.Users.updateOne({ username }, { $set: userUpdates });

    // Update all blogs by the user
    const blogUpdates = {};
    if ('publicBlogs' in updates) blogUpdates.isPublic = updates.publicBlogs;
    if ('commentsOnBlogs' in updates) blogUpdates.allowComments = updates.commentsOnBlogs;

    if (Object.keys(blogUpdates).length > 0) {
      await schemas.Blogs.updateMany({ author: username }, { $set: blogUpdates });
    }

    res.status(200).json({ message: 'User settings and blogs updated successfully' });
  } catch (error) {
    console.error('Error updating user settings and blogs:', error);
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

// Fetch public blogs
router.get('/public-blogs', async (req, res) => {
  try {
      const publicBlogs = await schemas.Blogs.find({ isPublic: true });
      res.json(publicBlogs);
  } catch (error) {
      console.error('Error fetching public blogs:', error);
      res.status(500).json({ message: 'Failed to fetch public blogs' });
  }
});

// Fetch blogs by author
router.get('/get-blogs-by-author', async (req, res) => {
  const { author } = req.query;

  try {
    const blogs = await schemas.Blogs.find({ author });
    if (!blogs) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Error fetching blog', details: error.message });
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

// Add new blog
router.post('/blogs', async(req, res) => {
    const { 
        title, 
        content, 
        author, 
        date, 
        commentCount, 
        comments, 
        isNews,
        isPublic,
        allowComments } = req.body;

    const blogData = {
        title: title,
        content: content,
        author: author,
        date: date,
        commentCount: commentCount,
        comments: comments,
        isNews: isNews,
        isPublic: isPublic,
        allowComments: allowComments
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

// Update blog author when user changes username
router.patch('/update-blog-author', async (req, res) => {
  const { prevUsername, newUsername } = req.body;

  try {
    const updatedBlog = await schemas.Blogs.updateMany(
      { author: prevUsername },
      { $set: { author: newUsername } }
    );

    res.json({ updatedCount: updatedBlog.nModified });
  } catch (err) {
    console.error('Error updating blogs with new username:', err);
    res.status(500).json({ error: 'Server error' });
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

// Update blogs to public or not public
router.patch('/update-public-blogs', async (req, res) => {
  const { username, isPublic } = req.body;

  try {
      await schemas.Blogs.updateMany({ author: username }, { $set: { isPublic } });
      res.status(200).json({ message: 'Blog settings updated successfully' });
  } catch (error) {
      console.error('Error updating blog settings:', error);
      res.status(500).json({ message: 'Failed to update blog settings' });
  }
});

// Update blogs comments to public or not public
router.patch('/update-public-blog-comments', async (req, res) => {
  const { username, allowComments } = req.body;

  try {
      await schemas.Blogs.updateMany({ author: username }, { $set: { allowComments } });
      res.status(200).json({ message: 'Blog settings updated successfully' });
  } catch (error) {
      console.error('Error updating blog settings:', error);
      res.status(500).json({ message: 'Failed to update blog settings' });
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

///////////////////
//               //
//  Card Routes  //
//               //
///////////////////

const API_BASE_URL = 'https://api.swu-db.com';

router.get('/cards', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cards`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).send('Server Error');
  }
});

router.get('/cards/:id', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cards/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching card with id ${req.params.id}:`, error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;