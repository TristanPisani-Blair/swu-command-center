import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './BuildADeck.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const BuildADeck = () => {
  const { deckId } = useParams();
  const { user, getAccessTokenSilently } = useAuth0();
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState({
    id: deckId,
    userId: user?.sub,
    leader: null,
    base: null,
    mainBoard: [],
    sideBoard: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards/sor?format=json&pretty=true');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('API response:', data);

        if (data.data && Array.isArray(data.data)) {
          setCards(data.data);
          console.log('Fetched cards:', data.data);
        } else {
          throw new Error('API response does not contain a "data" array');
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, []);

  const addCardToDeck = (card) => {
    console.log('Adding card to deck:', card);
    setDeck((prevDeck) => {
      const mainBoard = [...prevDeck.mainBoard];
      const existingCard = mainBoard.find((c) => c.Name === card.Name);

      if (existingCard) {
        existingCard.count = (existingCard.count || 1) + 1;
      } else {
        mainBoard.push({ ...card, count: 1 });
      }

      return { ...prevDeck, mainBoard };
    });
    console.log('Updated deck state:', deck);
  };

  const removeCardFromDeck = (card) => {
    setDeck((prevDeck) => {
      const mainBoard = prevDeck.mainBoard.map((c) =>
        c.Name === card.Name ? { ...c, count: c.count - 1 } : c
      ).filter((c) => c.count > 0);

      return { ...prevDeck, mainBoard };
    });
    console.log('Updated deck state after removal:', deck);
  };

  const countCardOccurrences = (cards) => {
    const cardCount = {};
    cards.forEach((card) => {
      if (cardCount[card.Name]) {
        cardCount[card.Name]++;
      } else {
        cardCount[card.Name] = 1;
      }
    });
    return cardCount;
  };

  const cardCount = countCardOccurrences(deck.mainBoard);

  const saveDeck = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post('/api/decks', deck, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Deck saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Error saving deck');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="wrapper">
        <div className="deck-builder-leftNav">
          <h2>Your Deck</h2>
          <div className="deck-details">
            <div>Deck ID: {deck.id}</div>
            <div>
              <h3>Main Board ({deck.mainBoard.length})</h3>
              <ul>
                {deck.mainBoard.map((card, index) => (
                  <li key={index}>
                    {card.Name} {card.count > 1 && `x${card.count}`}
                    <button onClick={() => removeCardFromDeck(card)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
            <button className="save-deck-button" onClick={saveDeck}>Save Deck</button>
          </div>
        </div>

        <div className="cardlist-body">
          <h1>Available Cards</h1>
          <div>
            <hr className="divider" />
          </div>

          {error && <div className="error">{error}</div>}

          <div className="card-list">
            {cards.map((card, index) => {
              const isHorizontal = card.type === 'Leader' || card.type === 'Base';
              return (
                <div key={card.id || index} className={`card-item ${isHorizontal ? 'horizontal' : ''}`}>
                  {card.FrontArt ? (
                    <>
                      <img
                        src={card.FrontArt}
                        alt={card.Name}
                        className="card-image"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </>
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                  {card.Name && <h2>{card.Name}</h2>}
                  {card.aspects && <p>Aspect: {card.aspects.join(', ')}</p>}
                  {card.type && <p>Type: {card.type}</p>}
                  {card.cost !== undefined && <p>Cost: {card.cost}</p>}
                  {card.set && <p>Set: {card.set}</p>}
                  {card.MarketPrice && <p>Price: ${card.MarketPrice}</p>}
                  <button onClick={() => addCardToDeck(card)}>Add to Deck</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuildADeck;
