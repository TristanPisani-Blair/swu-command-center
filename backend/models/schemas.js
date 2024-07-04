const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  }, {
    timestamps: true,
});
  
const blogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: String, required: true },
    commentCount: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    isNews: { type: Boolean, default: false }
});

const commentSchema = new Schema({
    blogID: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Users = mongoose.model('Users', userSchema, 'Users');
const Blogs = mongoose.model('Blogs', blogSchema, 'Blogs');
const Comment = mongoose.model('Comment', commentSchema, 'Comment');
const mySchemas = {'Users':Users, 'Blogs':Blogs, 'Comment':Comment};

module.exports = mySchemas;