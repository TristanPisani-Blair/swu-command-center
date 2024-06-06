require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const authRoutes = require('./routes/auth');
const deckRoutes = require('./routes/cards');  // Assuming cards.js handles deck routes
const userRoutes = require('./routes/users');

const app = express();

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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('Welcome to the Deck Builder App!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

