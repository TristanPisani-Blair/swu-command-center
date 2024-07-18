require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const blogRoutes = require('./routes/blog');
const deckRoutes = require('./routes (Express)/deck');
const authRoutes = require('./routes/auth');
const deckRoutes = require('./routes/cards');  // Assuming cards.js handles deck routes
const userRoutes = require('./routes/users');

const app = express();

// Blog stuff
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));

// Use routes
app.use('/blogs', blogRoutes);

// Connect to MongoDB
const dbOptions = {useNewUrlParser:true, useUnifiedTopology:true};
mongoose.connect(process.env.MONGODB_URI, dbOptions)
.then(() => console.log('DB connected.'))
.catch(err => console.log('Error connecting to MongoDB.'));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

// End blog stuff
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.use('/auth', authRoutes);
app.use('/decks', deckRoutes);
app.use('/users', userRoutes);

// Proxy API requests
app.get('/api/cards/sor', (req, res) => {
  // Your proxy logic to fetch from the actual API
  res.redirect('https://api.swu-db.com/cards/sor?format=json&pretty=true');
});

// Connect to MongoDB
const dbOptions = {useNewUrlParser:true, useUnifiedTopology:true};
mongoose.connect(process.env.MONGODB_URI, dbOptions)
.then(() => console.log('DB connected.'))
.catch(err => console.log('Error connecting to MongoDB.'));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

// End blog stuff

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/decks', deckRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
