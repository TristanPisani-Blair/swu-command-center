const client = require('../config/database');

const saveUser = async (user) => {
  const db = client.db('SWUCCusers');  
  const usersCollection = db.collection('Users');

  const existingUser = await usersCollection.findOne({ userId: user.id });
  if (!existingUser) {
    await usersCollection.insertOne({
      userId: user.id,
      email: user.emails[0].value,
      name: user.displayName,
      decks: []
    });
  }
};

const saveDeck = async (userId, deck) => {
  const db = client.db('SWUCCusers');
  const usersCollection = db.collection('Users');

  await usersCollection.updateOne(
    { userId: userId },
    { $push: { decks: deck } }
  );
};

const getUserDecks = async (userId) => {
  const db = client.db('SWUCCusers');  
  const usersCollection = db.collection('Users');

  const user = await usersCollection.findOne({ userId: userId });
  return user.decks;
};

module.exports = { saveUser, saveDeck, getUserDecks };
