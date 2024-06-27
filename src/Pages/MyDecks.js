import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './MyDecks.css';

const MyDecks = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDecks = localStorage.getItem('decks');
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks));
    }
  }, []);

  const createNewDeck = () => {
    const newDeckId = uuidv4();
    const newDeck = {
      id: newDeckId,
      name: `Deck ${decks.length + 1}`,
    };
    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));
    navigate(`/build-a-deck/${newDeckId}`);
  };

  const deleteDeck = (deckId) => {
    const updatedDecks = decks.filter(deck => deck.id !== deckId);
    setDecks(updatedDecks);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));
  };

  return (
    <div className="my-decks">
      <h1>My Decks</h1>
      <button onClick={createNewDeck} className="create-deck-button">Create New Deck</button>
      <ul>
        {decks.map(deck => (
          <li key={deck.id}>
            <a href={`/deck/${deck.id}`}>{deck.name}</a>
            <button onClick={() => deleteDeck(deck.id)} className="delete-deck-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyDecks;
