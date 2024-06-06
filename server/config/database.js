const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) throw err;
  console.log('Connected to MongoDB');
  
  const db = client.db('SWUCC_Users');
  const usersCollection = db.collection('Users');

  // Creates indexes
  usersCollection.createIndex({ userId: 1 });
  usersCollection.createIndex({ email: 1 });
  usersCollection.createIndex({ userId: 1, "decks.name": 1 });
});

module.exports = client;
