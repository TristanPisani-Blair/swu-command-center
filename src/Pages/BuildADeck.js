import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [filters, setFilters] = useState({
    aspects: [],
    type: [],
    cost: [],
    set: []
  });  const [filteredingCards, setFilteredingCards] = useState(cards);
  const [showAspectChoices, setShowAspectChoices] = useState(false);
  const [showTypeChoices, setShowTypeChoices] = useState(false);
  const [showCostChoices, setShowCostChoices] = useState(false);
  const [showSetChoices, setShowSetChoices] = useState(false);

  const navigate = useNavigate();

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
  }, [deck.leader, deck.base, cards]);

  const filterCards = () => {
    let filtered = cards;
  
    // Filter by Leader
    if (!deck.leader) {
      filtered = filtered.filter(card => card.Type === 'Leader' || card.type === 'Leader');
    } else if (!deck.base) {
      // Filter by Base
      filtered = filtered.filter(card => card.Type === 'Base' || card.type === 'Base');
    } else {
      // Filter by other cards
      filtered = filtered.filter(card => card.Type !== 'Leader' && card.Type !== 'Base' && card.type !== 'Leader' && card.type !== 'Base');
    }
  
    // Apply filters
    const normalizedFilters = {
      aspects: filters.aspects.map(filter => filter.toLowerCase()),
      type: filters.type.map(filter => filter.toLowerCase()),
      cost: filters.cost.map(filter => filter.toLowerCase()),
      set: filters.set.map(filter => filter.toLowerCase()),
    };
  
    // Filter by Aspect
    if (normalizedFilters.aspects.length > 0) {
      filtered = filtered.filter(card =>
        card.Aspects && Array.isArray(card.Aspects)
          ? card.Aspects.some(aspect => normalizedFilters.aspects.includes(aspect.toLowerCase()))
          : false
      );
    }
  
    // Filter by Type
    if (normalizedFilters.type.length > 0) {
      filtered = filtered.filter(card =>
        card.Type && normalizedFilters.type.includes(card.Type.toLowerCase())
      );
    }
  
    // Filter by Cost
    if (normalizedFilters.cost.length > 0) {
      filtered = filtered.filter(card =>
        card.Cost !== undefined && normalizedFilters.cost.includes(card.Cost)
      );
    }
  
    // Filter by Set
    if (normalizedFilters.set.length > 0) {
      filtered = filtered.filter(card =>
        card.Set && normalizedFilters.set.includes(card.Set.toLowerCase())
      );
    }
  
    // Filter by Search Input
    if (search.trim() !== '') {
      filtered = filtered.filter(card =>
        card.Name.toLowerCase().includes(search.toLowerCase())
      );
    }

     // Apply sorting
    filtered = sortCards(filtered);
  
    setFilteredCards(filtered);
  };
  
  const sortCards = (cards) => {
    switch (sortOption) {
      case 'name-asc':
        return cards.slice().sort((a, b) => a.Name.localeCompare(b.Name));
      case 'name-desc':
        return cards.slice().sort((a, b) => b.Name.localeCompare(a.Name));
      case 'number-asc':
        return cards.slice().sort((a, b) => a.Number - b.Number);
      case 'number-desc':
        return cards.slice().sort((a, b) => b.Number - a.Number);
      default:
        return cards;
    }
  };
  

  // Display sorting and filtering text
  const getSortingText = () => {
    if (!sortOption) return '';
    
    return sortOption.includes('name') 
      ? `Sorted by: Card Name (${sortOption.includes('asc') ? 'A-Z' : 'Z-A'})`
      : `Sorted by: Card Number (${sortOption.includes('asc') ? 'Ascending' : 'Descending'})`;
  };
  
  const getFilteringText = () => {
    const activeFilters = [];
    if (filters.aspects.length > 0) activeFilters.push(`Aspect: ${filters.aspects.join(', ')}`);
    if (filters.type.length > 0) activeFilters.push(`Type: ${filters.type.join(', ')}`);
    if (filters.cost.length > 0) activeFilters.push(`Cost: ${filters.cost.join(', ')}`);
    if (filters.set.length > 0) activeFilters.push(`Set: ${filters.set.join(', ')}`);
  
    return activeFilters.length > 0 ? `Filtered by: ${activeFilters.join(' | ')}` : '';
  };

  const addCardToDeck = (card, toSideBoard = false) => {
    setDeck((prevDeck) => {
      let newDeck = { ...prevDeck };
      let board = toSideBoard ? newDeck.sideBoard : newDeck.mainBoard;
      let otherBoard = toSideBoard ? newDeck.mainBoard : newDeck.sideBoard;
  
      if (card.Type === 'Leader' || card.type === 'Leader') {
        if (prevDeck.leader) {
          alert('Only one leader is allowed per deck.');
          return prevDeck;
        }
        newDeck.leader = card;
      } else if (card.Type === 'Base' || card.type === 'Base') {
        if (prevDeck.base) {
          alert('Only one base is allowed per deck.');
          return prevDeck;
        }
        newDeck.base = card;
      }       
      else {
        // Check if the card exists in the current board
        const existingCardInBoard = board.find((c) => c.Name === card.Name);
        // Check if the card exists in the other board (to prevent more than 3 copies overall)
        const existingCardInOtherBoard = otherBoard.find((c) => c.Name === card.Name);
        const totalCopies = (existingCardInBoard?.count || 0) + (existingCardInOtherBoard?.count || 0);
  
        // Restrict to a maximum of 3 copies overall
        if (totalCopies >= 3) {
          alert('You cannot have more than 3 copies of a single card in the deck.');
          return prevDeck;
        }
  
        // If card exists in the current board, increment the count
        if (existingCardInBoard) {
          existingCardInBoard.count += 1;
        } else {
          // Otherwise, add the card with a count of 1
          board.push({ ...card, count: 1 });
        }
      }
  
      // Return the updated deck
      return newDeck;
    });
  };


  const removeCardFromDeck = (card, fromSideBoard = false) => {
    setDeck((prevDeck) => {
      let newDeck = { ...prevDeck };
      let board = fromSideBoard ? newDeck.sideBoard : newDeck.mainBoard;

      if ((card.Type === 'Leader' || card.type === 'Leader') && prevDeck.leader && prevDeck.leader.Name === card.Name) {
        newDeck.leader = null;
      } else if ((card.Type === 'Base' || card.type === 'Base') && prevDeck.base && prevDeck.base.Name === card.Name) {
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
    const calculateBoardPrice = (board) => {
      return board.reduce((total, card) => {
        const cardPrice = parseFloat(card.MarketPrice) || 0; // Ensure cardPrice is a number
        return total + cardPrice * (card.count || 1); // Multiply by count if available
      }, 0);
    };
  
    const leaderPrice = deck.leader ? parseFloat(deck.leader.MarketPrice) || 0 : 0;
    const basePrice = deck.base ? parseFloat(deck.base.MarketPrice) || 0 : 0;
    const mainBoardPrice = calculateBoardPrice(deck.mainBoard);
    const sideBoardPrice = calculateBoardPrice(deck.sideBoard);
  
    const totalPrice = leaderPrice + basePrice + mainBoardPrice + sideBoardPrice;
  
    // Log the result for debugging purposes
    console.log('Total Price:', totalPrice);
  
    // Ensure totalPrice is a number before calling .toFixed()
    return !isNaN(totalPrice) ? totalPrice.toFixed(2) : '0.00';
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

   // Filter functions
   const handleCheckboxChange = (category, value) => {
    setFilters(prevFilters => {
      // Get the current array of selected values for the category
      const categoryArray = prevFilters[category] || [];

      // Check if the value is already in the array
      const isValueInArray = categoryArray.includes(value);
  
      // If it's already selected, remove it, otherwise add it
      const updatedValues = isValueInArray 
        ? categoryArray.filter(item => item !== value)
        : [...categoryArray, value];
  
      return {
        ...prevFilters,
        [category]: updatedValues,
      };
    });
  };

    
  // Update filtered cards whenever filters, search input, or cards change
  useEffect(() => {
    filterCards();
  }, [filters, search, cards, deck.leader, deck.base, sortOption]);
  


  return (
    <div>
      <Navbar />
      <div className="deck-builder-wrapper">
        <div className="deck-builder-leftNav">
        <div>
        <div
          contentEditable
          className="editable-deck-name"
          onBlur={(e) => {
            const newName = e.target.innerText.trim();
            if (newName !== deck.deckName && newName !== "") {
              setDeck({ ...deck, deckName: newName });
            }
          }}
          suppressContentEditableWarning={true}
          onInput={(e) => {
            const text = e.target.innerText;
            e.target.innerText = text; // Ensure the text is updated correctly
          }}
        >
          {deck.deckName || "Your Deck"}
        </div>
      </div>
          <div className="deck-details">
            <div>Total Price: ${calculateTotalPrice()}</div>
            <div>Leader: {deck.leader ? deck.leader.Name : 'No leader selected'}</div>
            <div>Base: {deck.base ? deck.base.Name : 'No base selected'}</div>
            <div>
              <h3>Main Board ({deck.mainBoard.reduce((total, card) => total + card.count, 0)})</h3>
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
              <h3>Sideboard ({deck.sideBoard.reduce((total, card) => total + card.count, 0)})</h3>
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
                    {/* Aspect Category */}
                    <li className="bd-clickable" onClick={() => setShowAspectChoices(!showAspectChoices)}>Aspect ▼</li>
                    {showAspectChoices && (
                      <ul className="bd-aspect-options">
                        {/* Aspect Checkbox Options */}
                        {['Aggression', 'Command', 'Cunning', 'Heroism', 'Vigilance', 'Villainy'].map(option => (
                          <li key={option}>
                            <input 
                              type="checkbox" 
                              id={option.toLowerCase()} 
                              value={option} 
                              checked={filters.aspects.includes(option)}
                              onChange={() => handleCheckboxChange('aspects', option)} 
                            />
                            <label htmlFor={option.toLowerCase()}>{option}</label>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Type Category */}
                    <li className="bd-clickable" onClick={() => setShowTypeChoices(!showTypeChoices)}>Type ▼</li>
                    {showTypeChoices && (
                      <ul className="bd-type-options">
                        {/* Type Checkbox Options */}
                        {['Event', 'Unit', 'Upgrade'].map(option => (
                          <li key={option}>
                            <input 
                              type="checkbox" 
                              id={option.toLowerCase().replace(' ', '-')} 
                              value={option} 
                              checked={filters.type.includes(option)}
                              onChange={() => handleCheckboxChange('type', option)} 
                            />
                            <label htmlFor={option.toLowerCase().replace(' ', '-')}>{option}</label>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Cost Category */}
                    <li className="bd-clickable" onClick={() => setShowCostChoices(!showCostChoices)}>Cost ▼</li>
                    {showCostChoices && (
                      <ul className="bd-cost-options">
                        {/* Cost Checkbox Options */}
                        {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'].map(option => (
                          <li key={option}>
                            <input 
                              type="checkbox" 
                              id={`cost-${option}`} 
                              value={option} 
                              checked={filters.cost.includes(option)}
                              onChange={() => handleCheckboxChange('cost', option)} 
                            />
                            <label htmlFor={`cost-${option}`}>{option}</label>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Set Category */}
                    <li className="bd-clickable" onClick={() => setShowSetChoices(!showSetChoices)}>Set ▼</li>
                    {showSetChoices && (
                      <ul className="bd-set-options">
                        {/* Set Checkbox Options */}
                        {['SOR', 'SHD'].map(option => (
                          <li key={option}>
                            <input 
                              type="checkbox" 
                              id={option.toLowerCase().replace(/ /g, '-')} 
                              value={option} 
                              checked={filters.set.includes(option)}
                              onChange={() => handleCheckboxChange('set', option)} 
                            />
                            <label htmlFor={option.toLowerCase().replace(/ /g, '-')}>{option}</label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </ul>
                </div>
              )}

            </div>
          </div>

          <div className="bd-active-filters">
            <p className="sorting-text">{getSortingText()}</p>
            <p className="filtering-text">{getFilteringText()}</p>
          </div>

          {error && <div className="error">{error}</div>}

          {error && <div className="error">{error}</div>}

          <ul className="card-list">
            {filteredCards.map((card, index) => {
              const isHorizontal = card.Type === 'Leader' || card.Type === 'Base' || card.type === 'Leader' || card.type === 'Base';
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
                    {card.Name && <h2>{card.Name}</h2>}
                    {card.Aspects && <p>Aspect: {card.Aspects.join(', ')}</p>}
                    {card.Type && <p>Type: {card.Type}</p>}
                    {card.Cost !== undefined && <p>Cost: {card.Cost}</p>}
                    {card.set && <p>Set: {card.set}</p>}
                    {card.MarketPrice && <p>Price: ${card.MarketPrice}</p>}
                    <button onClick={() => addCardToDeck(card)}>Add to Deck</button>
                    <button onClick={() => addCardToDeck(card, true)}>Add to Sideboard</button>
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