const express = require('express');
const Deck = require('../models (Mongoose)/deck');

const router = express.Router();

// Create a new deck
router.post('/', async (req, res) => {
  const { deckId, userId, deckName, leader, base, mainBoard, sideBoard } = req.body;

  const deck = new Deck({ deckId, userId, deckName, leader, base, mainBoard, sideBoard });

  try {
    const newDeck = await deck.save();
    res.status(201).json(newDeck);
  } catch (error) {
    console.error('Error saving deck:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all decks for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    const decks = await Deck.find({ userId });
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single deck by ID
router.get('/:userId/:deckId', async (req, res) => {
  try {
    const deck = await Deck.findOne({ userId: req.params.userId, deckId: req.params.deckId });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }
    res.json(deck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a deck
router.put('/:userId/:deckId', async (req, res) => {
  try {
    const deck = await Deck.findOneAndUpdate(
      { userId: req.params.userId, deckId: req.params.deckId },
      req.body,
      { new: true }
    );
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }
    res.json(deck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a deck
router.delete('/:userId/:deckId', async (req, res) => {
  try {
    const deck = await Deck.findOneAndDelete({ userId: req.params.userId, deckId: req.params.deckId });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }
    res.json({ message: 'Deck deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all decks
router.get('/decks', async (req, res) => {
  try {
    const decks = await Deck.find();
    res.status(200).json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: 'Error fetching decks.', details: error.message });
  }
});

module.exports = router;