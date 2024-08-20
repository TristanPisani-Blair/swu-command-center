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
  const [filteredCards, setFilteredCards] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showSortingOptions, setShowSortingOptions] = useState(false);
  const [showFilteringOptions, setShowFilteringOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showAspectChoices, setShowAspectChoices] = useState(false);
  const [showTypeChoices, setShowTypeChoices] = useState(false);
  const [showCostChoices, setShowCostChoices] = useState(false);
  const [showSetChoices, setShowSetChoices] = useState(false);

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
          setFilteredCards(data.data); // Initialize filtered cards with all cards
        } else {
          throw new Error('API response does not contain a "data" array');
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    filterCards();
  }, [deck.leader, deck.base]);

  const filterCards = () => {
    let filtered = cards;

    if (!deck.leader) {
      filtered = cards.filter(card => card.type === 'Leader');
    } else if (!deck.base) {
      filtered = cards.filter(card => card.type === 'Base');
    } else {
      filtered = cards.filter(card => card.type !== 'Leader' && card.type !== 'Base');
    }

    setFilteredCards(filtered);
  };

  const addCardToDeck = (card, toSideBoard = false) => {
    setDeck((prevDeck) => {
      let newDeck = { ...prevDeck };
      let board = toSideBoard ? newDeck.sideBoard : newDeck.mainBoard;
      let otherBoard = toSideBoard ? newDeck.mainBoard : newDeck.sideBoard;

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
        const existingCardInBoard = board.find((c) => c.Name === card.Name);
        const existingCardInOtherBoard = otherBoard.find((c) => c.Name === card.Name);
        const totalCopies = (existingCardInBoard?.count || 0) + (existingCardInOtherBoard?.count || 0);

        if (totalCopies >= 3) {
          alert('You cannot have more than 3 copies of a single card in the deck.');
          return prevDeck;
        }

        if (existingCardInBoard) {
          existingCardInBoard.count = (existingCardInBoard.count || 1) + 1;
        } else {
          board.push({ ...card, count: 1 });
        }
      }

      return newDeck;
    });
  };

  const removeCardFromDeck = (card, fromSideBoard = false) => {
    setDeck((prevDeck) => {
      let newDeck = { ...prevDeck };
      let board = fromSideBoard ? newDeck.sideBoard : newDeck.mainBoard;

      if (card.type === 'Leader' && prevDeck.leader && prevDeck.leader.Name === card.Name) {
        newDeck.leader = null;
      } else if (card.type === 'Base' && prevDeck.base && prevDeck.base.Name === card.Name) {
        newDeck.base = null;
      } else {
        board = board
          .map((c) => (c.Name === card.Name ? { ...c, count: c.count - 1 } : c))
          .filter((c) => c.count > 0);
        if (fromSideBoard) {
          newDeck.sideBoard = board;
        } else {
          newDeck.mainBoard = board;
        }
      }

      return newDeck;
    });
  };

  const moveCardBetweenBoards = (card, toSideBoard) => {
    setDeck((prevDeck) => {
      let newDeck = { ...prevDeck };
      let sourceBoard = toSideBoard ? newDeck.mainBoard : newDeck.sideBoard;
      let targetBoard = toSideBoard ? newDeck.sideBoard : newDeck.mainBoard;

      const cardInSourceBoard = sourceBoard.find((c) => c.Name === card.Name);

      if (cardInSourceBoard) {
        cardInSourceBoard.count -= 1;
        if (cardInSourceBoard.count === 0) {
          sourceBoard = sourceBoard.filter((c) => c.Name !== card.Name);
        }
        const cardInTargetBoard = targetBoard.find((c) => c.Name === card.Name);
        if (cardInTargetBoard) {
          cardInTargetBoard.count += 1;
        } else {
          targetBoard.push({ ...card, count: 1 });
        }
      }

      newDeck.mainBoard = toSideBoard ? sourceBoard : targetBoard;
      newDeck.sideBoard = toSideBoard ? targetBoard : sourceBoard;

      return newDeck;
    });
  };

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

  const handleCheckboxChange = (itemName) => {
    if (selectedFilters.includes(itemName)) {
        setSelectedFilters(selectedFilters.filter(filter => filter !== itemName));
    } else {
        setSelectedFilters([...selectedFilters, itemName]);
    }
  };

  // Search function to filter cards by user input
  const searchFilteredCards = cards.filter(card =>
    search.trim() === '' || card.Name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort functions
  const sortCards = (cards) => {
    switch (sortOption) {
      case 'name-asc':
        return cards.sort((a, b) => a.Name.localeCompare(b.Name));
      case 'name-desc':
        return cards.sort((a, b) => b.Name.localeCompare(a.Name));
      case 'number-asc':
        return cards.sort((a, b) => a.Number - b.Number);
      case 'number-desc':
        return cards.sort((a, b) => b.Number - a.Number);
      default:
        return cards;
    }
  };

  // List of cards sorted
  const sortedAndFilteredCards = sortCards(searchFilteredCards);

  return (
    <div>
      <Navbar />
      <div className="deck-builder-wrapper">
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
                    <button onClick={() => moveCardBetweenBoards(card, true)}>Move to Sideboard</button>
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
                    <button onClick={() => removeCardFromDeck(card, true)}>Remove</button>
                    <button onClick={() => moveCardBetweenBoards(card, false)}>Move to Mainboard</button>
                  </li>
                ))}
              </ul>
            </div>
            <button className="save-deck-button" onClick={saveDeck}>Save Deck</button>
          </div>
        </div>

        <div className="builddeck-body">
          <h1>Available Cards</h1>
          <div>
            <hr className="divider" />
          </div>

          <div className="bd-search">
            <div className="bd-search-bar">
              <input type="text" 
                id="bd-card-search" 
                placeholder="Search for a card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>    
          </div>

          <div className="bd-sortfilter">
            <div className="bd-sortby">
              <p className="bd-clickable" onClick={() => setShowSortingOptions(!showSortingOptions)}>
                  Sort By ▼
              </p>
              {showSortingOptions && (
                <div className={`bd-sorting-options ${showSortingOptions ? 'open' : ''}`}>
                <ul>
                  <li onClick={() => setSortOption('name-asc')}>Card Name (A-Z)</li>
                  <li onClick={() => setSortOption('name-desc')}>Card Name (Z-A)</li>
                  <li onClick={() => setSortOption('number-asc')}>Card Number (Ascending)</li>
                  <li onClick={() => setSortOption('number-desc')}>Card Number (Descending)</li>
                </ul>
              </div>
              )}
            </div>

            <div className="bd-filterby">
              <p className="bd-clickable" onClick={() => setShowFilteringOptions(!showFilteringOptions)}>
                  Filter By ▼
              </p>
              {showFilteringOptions && (
                <div className="bd-filtering-options">
                  <ul>
                    <li className="bd-clickable" onClick={() => setShowAspectChoices(!showAspectChoices)}>Aspect ▼</li>
                      {showAspectChoices && (
                        <div className="bd-aspect-options">
                            <li>
                              <input type="checkbox" id="aggression" value="Aggression" onChange={() => handleCheckboxChange('Aggression')} />
                              <label htmlFor="aggression">Aggression</label>
                            </li>
                            <li>
                              <input type="checkbox" id="command" value="Command" onChange={() => handleCheckboxChange('Command')} />
                              <label htmlFor="command">Command</label>
                            </li>
                            <li>
                              <input type="checkbox" id="cunning" value="Cunning" onChange={() => handleCheckboxChange('Cunning')} />
                              <label htmlFor="cunning">Cunning</label>
                            </li>
                            <li>
                              <input type="checkbox" id="heroism" value="Heroism" onChange={() => handleCheckboxChange('Heroism')} />
                              <label htmlFor="heroism">Heroism</label>
                            </li>
                            <li>
                              <input type="checkbox" id="vigilance" value="Vigilance" onChange={() => handleCheckboxChange('Vigilance')} />
                              <label htmlFor="vigilance">Vigilance</label>
                            </li>
                            <li>
                              <input type="checkbox" id="villainy" value="Villainy" onChange={() => handleCheckboxChange('Villainy')} />
                              <label htmlFor="villainy">Villainy</label>
                            </li>
                        </div>
                      )}

                    <li className="bd-clickable" onClick={() => setShowTypeChoices(!showTypeChoices)}>Type ▼</li>
                      {showTypeChoices && (
                        <div className="bd-type-options">
                            <li>
                              <input type="checkbox" id="base" value="Base" onChange={() => handleCheckboxChange('Base')} />
                              <label htmlFor="base">Base</label>
                            </li>
                            <li>
                              <input type="checkbox" id="event" value="Event" onChange={() => handleCheckboxChange('Event')} />
                              <label htmlFor="event">Event</label>
                            </li>
                            <li>
                              <input type="checkbox" id="leader" value="Leader" onChange={() => handleCheckboxChange('Leader')} />
                              <label htmlFor="leader">Leader</label>
                            </li>
                            <li>
                              <input type="checkbox" id="token-upgrade" value="Token Upgrade" onChange={() => handleCheckboxChange('Token Upgrade')} />
                              <label htmlFor="token-upgrade">Token Upgrade</label>
                            </li>
                            <li>
                              <input type="checkbox" id="unit" value="Unit" onChange={() => handleCheckboxChange('Unit')} />
                              <label htmlFor="unit">Unit</label>
                            </li>
                            <li>
                              <input type="checkbox" id="upgrade" value="Upgrade" onChange={() => handleCheckboxChange('Upgrade')} />
                              <label htmlFor="upgrade">Upgrade</label>
                            </li>
                        </div>
                      )}

                    <li className="bd-clickable" onClick={() => setShowCostChoices(!showCostChoices)}>Cost ▼</li>
                      {showCostChoices && (
                          <div className="cl-cost-options">
                            <li>
                              <input type="checkbox" id="zero" value="Zero" onChange={() => handleCheckboxChange('Zero')} />
                              <label htmlFor="zero">0</label>
                            </li>
                            <li>
                              <input type="checkbox" id="one" value="One" onChange={() => handleCheckboxChange('One')} />
                              <label htmlFor="one">1</label>
                            </li>
                            <li>
                              <input type="checkbox" id="two" value="Two" onChange={() => handleCheckboxChange('Two')} />
                              <label htmlFor="two">2</label>
                            </li>
                            <li>
                              <input type="checkbox" id="three" value="Three" onChange={() => handleCheckboxChange('Three')} />
                              <label htmlFor="three">3</label>
                            </li>
                            <li>
                              <input type="checkbox" id="four" value="Four" onChange={() => handleCheckboxChange('Four')} />
                              <label htmlFor="four">4</label>
                            </li>
                            <li>
                              <input type="checkbox" id="five" value="Five" onChange={() => handleCheckboxChange('Five')} />
                              <label htmlFor="five">5</label>
                            </li>
                              <li>
                              <input type="checkbox" id="six" value="Six" onChange={() => handleCheckboxChange('Six')} />
                              <label htmlFor="six">6</label>
                            </li>
                            <li>
                              <input type="checkbox" id="seven" value="Seven" onChange={() => handleCheckboxChange('Seven')} />
                              <label htmlFor="seven">7</label>
                            </li>
                          </div>
                      )}

                    <li className="bd-clickable" onClick={() => setShowSetChoices(!showSetChoices)}>Set ▼</li>
                      {showSetChoices && (
                        <div className="cl-set-options">
                            <li>
                              <input type="checkbox" id="shadows-of-the-galaxy" value="Shadows of the Galaxy" onChange={() => handleCheckboxChange('Shadows of the Galaxy')} />
                              <label htmlFor="shadows-of-the-galaxy">Shadows of the Galaxy</label>
                            </li>
                            <li>
                              <input type="checkbox" id="spark-of-rebellion" value="Spark of Rebellion" onChange={() => handleCheckboxChange('Spark of Rebellion')} />
                              <label htmlFor="spark-of-rebellion">Spark of Rebellion</label>
                            </li>
                        </div>
                      )}
                  </ul>
                </div>
              )}

            </div>
          </div>


          {error && <div className="error">{error}</div>}

          <ul className="card-list">
            {sortedAndFilteredCards.map((card, index) => {
              const isHorizontal = card.type === 'Leader' || card.type === 'Base';
              return (
                <li key={index}>
                  <div className={`card-item ${isHorizontal ? 'horizontal' : ''}`}>
                  <div className="bd-card-image-div">
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
                    </div>
                    <div className="bd-card-info">
                      {card.Name && <h2>{card.Name}</h2>}
                      {card.Aspects && <p>Aspect: {card.Aspects.join(', ')}</p>}
                      {card.Type && <p>Type: {card.Type}</p>}
                      {card.Cost !== undefined && <p>Cost: {card.Cost}</p>}
                      {card.Set && <p>Set: {card.Set}</p>}
                      {card.MarketPrice && <p>Price: ${card.MarketPrice}</p>}
                      <div className='bd-buttons'>
                        <button onClick={() => addCardToDeck(card)}>Add to Deck</button>
                        <button onClick={() => addCardToDeck(card, true)}>Add to Sideboard</button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuildADeck;
