const mongoose = require('mongoose');

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

const Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;
