import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './MyDecks.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const MyDecks = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth0();

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/decks?userId=${user.sub}`);
        setDecks(response.data);
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };

    if (user) {
      fetchDecks();
    }
  }, [user]);

  const createNewDeck = () => {
    const newDeckId = uuidv4();  // Generate a new unique ID for the new deck
    navigate(`/build-a-deck/${newDeckId}`);  // Navigate to the BuildADeck page with the new deck ID
  };

  const deleteDeck = async (deckId) => {
    try {
      await axios.delete(`http://localhost:4000/decks/${user.sub}/${deckId}`);
      setDecks(decks.filter(deck => deck.deckId !== deckId));  // Remove the deleted deck from the state
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  };

  return (
    <div className="my-decks">
      <h1>My Decks</h1>
      <button onClick={createNewDeck} className="create-deck-button">Create New Deck</button>
      <ul>
        {decks.map(deck => (
          <li key={deck.deckId}>
            <a href={`/build-a-deck/${deck.deckId}`} className="view-deck-link">{deck.deckName}</a>  {/* Link to view or edit the deck */}
            <button onClick={() => deleteDeck(deck.deckId)} className="delete-deck-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyDecks;
