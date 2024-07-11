import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BuildADeck.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import { useAuth0 } from '@auth0/auth0-react';

const BuildADeck = () => {
  const { deckId } = useParams();
  const { user } = useAuth0();
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState({
    deckId: deckId,
    userId: user?.sub || 'defaultUserId',
    deckName: '',
    leader: null,
    base: null,
    mainBoard: [],
    sideBoard: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/decks/${user.sub}/${deckId}`);
        const fetchedDeck = response.data;
        setDeck({
          deckId: fetchedDeck.deckId,
          userId: fetchedDeck.userId,
          deckName: fetchedDeck.deckName,
          leader: fetchedDeck.leader,
          base: fetchedDeck.base,
          mainBoard: fetchedDeck.mainBoard,
          sideBoard: fetchedDeck.sideBoard,
        });
      } catch (error) {
        console.error('Error fetching deck:', error);
      }
    };

    if (user && deckId) {
      fetchDeck();
    }
  }, [user, deckId]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards/sor?format=json&pretty=true');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setCards(data.data);
        } else {
          throw new Error('API response does not contain a "data" array');
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCards();
  }, []);

  const addCardToDeck = (card) => {
    setDeck((prevDeck) => {
      let newDeck = { ...prevDeck };

      if (card.type === 'Leader') {
        if (prevDeck.leader) {
          alert('Only one leader is allowed per deck.');
          return prevDeck;
        }
        newDeck.leader = card;
      } else if (card.type === 'Base') {
        if (prevDeck.base) {
          alert('Only one base is allowed per deck.');
          return prevDeck;
        }
        newDeck.base = card;
      } else {
        const mainBoard = [...prevDeck.mainBoard];
        const existingCard = mainBoard.find((c) => c.Name === card.Name);

        if (existingCard) {
          existingCard.count = (existingCard.count || 1) + 1;
        } else {
          mainBoard.push({ ...card, count: 1 });
        }
        newDeck.mainBoard = mainBoard;
      }

      return newDeck;
    });
  };

  const removeCardFromDeck = (card) => {
    setDeck((prevDeck) => {
      let newDeck = { ...prevDeck };

      if (card.type === 'Leader' && prevDeck.leader && prevDeck.leader.Name === card.Name) {
        newDeck.leader = null;
      } else if (card.type === 'Base' && prevDeck.base && prevDeck.base.Name === card.Name) {
        newDeck.base = null;
      } else {
        const mainBoard = prevDeck.mainBoard
          .map((c) => (c.Name === card.Name ? { ...c, count: c.count - 1 } : c))
          .filter((c) => c.count > 0);
        newDeck.mainBoard = mainBoard;
      }

      return newDeck;
    });
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

  const calculateTotalPrice = () => {
    return deck.mainBoard.reduce((total, card) => {
      return total + (card.MarketPrice * card.count || 0);
    }, 0).toFixed(2);
  };

  const saveDeck = async () => {
    try {
      const response = await axios.post('http://localhost:4000/decks', deck, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Deck saved successfully!');
    } catch (err) {
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
            <div>
              Deck Name: <input type="text" value={deck.deckName} onChange={(e) => setDeck({ ...deck, deckName: e.target.value })} />
            </div>
            <div>Total Price: ${calculateTotalPrice()}</div>
            <div>Leader: {deck.leader ? deck.leader.Name : 'No leader selected'}</div>
            <div>Base: {deck.base ? deck.base.Name : 'No base selected'}</div>
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
            <div>
              <h3>Sideboard ({deck.sideBoard.length})</h3>
              <ul>
                {deck.sideBoard.map((card, index) => (
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
