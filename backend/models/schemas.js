const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true  },
    publicDecks: { type: Boolean, default: true },
    publicBlogs: { type: Boolean, default: true },
    commentsOnDecks: { type: Boolean, default: true },
    commentsOnBlogs: { type: Boolean, default: true }
});
  
const blogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: String, required: true },
    commentCount: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    isNews: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true },
    allowComments: { type: Boolean, default: true }
});

const commentSchema = new Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const deckSchema = new mongoose.Schema({
    deckId: { type: String, required: true },
    userId: { type: String, required: true },
    deckName: { type: String, required: true },
    leader: Object,
    base: Object,
    mainBoard: Array,
    sideBoard: Array,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Users = mongoose.model('Users', userSchema, 'Users');
const Blogs = mongoose.model('Blogs', blogSchema, 'Blogs');
const Comments = mongoose.model('Comments', commentSchema, 'Comments');
const Decks = mongoose.model('Decks', deckSchema, 'Decks');
const mySchemas = {'Users':Users, 'Blogs':Blogs, 'Comments':Comments, 'Decks':Decks};

module.exports = mySchemas;