const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error('MongoDB connection string is missing in .env file.');
  process.exit(1);
}

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));
