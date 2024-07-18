const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    id: {type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: String, required: true },
    commentCount: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    isNews: { type: Boolean, default: false }
});

const commentSchema = new Schema({
    blogID: { type: Number, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true }
});

const Blog = mongoose.model('Blog', blogSchema, 'blogs');
const Comment = mongoose.model('Comment', commentSchema, 'comments');
const mySchemas = {'Blog':Blog, 'Comment':Comment}

module.exports = mySchemas;
