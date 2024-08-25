require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
/*const blogRoutes = require('./routes (Express)/blog'); */
const deckRoutes = require('./routes (Express)/deck');
const authRoutes = require('./routes (Express)/auth');
const cardRoutes = require('./routes (Express)/cards'); 
const userRoutes = require('./routes (Express)/users');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.MONGODB_URI, dbOptions)
  .then(() => console.log('DB connected.'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Session Management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Static Files from React App
app.use(express.static(path.join(__dirname, 'build')));

// Define Routes
app.use('/auth', authRoutes);
app.use('/decks', deckRoutes);
app.use('/users', userRoutes);
/*app.use('/blogs', blogRoutes); */
app.use('/cards', cardRoutes);

// Proxy API Requests
app.get('/api/cards/sor', (req, res) => {
  res.redirect('https://api.swu-db.com/cards/sor?format=json&pretty=true');
});

// Catch-all for serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});