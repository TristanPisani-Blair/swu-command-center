import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import './Collection.css'; // Adjust path if necessary

const Collection = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showSortingOptions, setShowSortingOptions] = useState(false);
  const [showFilteringOptions, setShowFilteringOptions] = useState(false);
  const [filters, setFilters] = useState({
    aspects: [],
    type: [],
    cost: [],
    set: []
  });
  const [filteredCards, setFilteredCards] = useState(cards);
  const [cardQuantities, setCardQuantities] = useState({});
  const [showAspectChoices, setShowAspectChoices] = useState(false);
  const [showTypeChoices, setShowTypeChoices] = useState(false);
  const [showCostChoices, setShowCostChoices] = useState(false);
  const [showSetChoices, setShowSetChoices] = useState(false);

  const navigate = useNavigate();


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
          setFilteredCards(data.data);
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
  }, [filters, search, cards]);

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

const filterCards = () => {
  let updatedCards = cards;

  const normalizedFilters = {
    aspects: filters.aspects.map(filter => filter.toLowerCase()),
    type: filters.type.map(filter => filter.toLowerCase()),
    cost: filters.cost.map(filter => filter.toLowerCase()),
    set: filters.set.map(filter => filter.toLowerCase()),
  };

  // Filter by Aspect
  if (normalizedFilters.aspects.length > 0) {
    updatedCards = updatedCards.filter(card =>
      card.Aspects && Array.isArray(card.Aspects)
        ? card.Aspects.some(aspect => normalizedFilters.aspects.includes(aspect.toLowerCase()))
        : false
    );
  }

  // Filter by Type
  if (normalizedFilters.type.length > 0) {
    updatedCards = updatedCards.filter(card =>
      card.Type && normalizedFilters.type.includes(card.Type.toLowerCase())
    );
  }

  // Filter by Cost
  if (normalizedFilters.cost.length > 0) {
    updatedCards = updatedCards.filter(card =>
      card.Cost !== undefined && normalizedFilters.cost.includes(card.Cost)
    );
  }

  // Filter by Set
  if (normalizedFilters.set.length > 0) {
    updatedCards = updatedCards.filter(card =>
      card.Set && normalizedFilters.set.includes(card.Set.toLowerCase())
    );
  }

  // Filter by Search Input
  if (search.trim() !== '') {
    updatedCards = updatedCards.filter(card =>
      card.Name.toLowerCase().includes(search.toLowerCase())
    );
  }

  setFilteredCards(updatedCards);
};

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

// Display sort and filtered by text
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

// List of cards sorted
const sortedAndFilteredCards = sortCards(filteredCards);

const handleCardClick = (card) => {
  const cardNumber = encodeURIComponent(card.Number);
  const cardName = encodeURIComponent(card.Name);
  navigate(`/card/${cardNumber}/${cardName}`);
};

// Update filtered cards whenever filters or search input change
useEffect(() => {
  filterCards();
}, [filters, search, cards]);

  const calculateTotalPrice = () => {
    return Object.keys(cardQuantities).reduce((total, cardKey) => {
      const [cardName, variantType] = cardKey.split('|');
      const card = cards.find(c => c.Name === cardName && c.VariantType === variantType);
      if (card) {
        const cardPrice = parseFloat(card.MarketPrice) || 0;
        const cardQuantity = cardQuantities[cardKey] || 0;
        return total + (cardPrice * cardQuantity);
      }
      return total;
    }, 0).toFixed(2);
  };


  const handleQuantityChange = (cardName, variantType, increment) => {
    const key = `${cardName}|${variantType}`;
    setCardQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[key] || 0;
      const newQuantity = increment ? currentQuantity + 1 : Math.max(currentQuantity - 1, 0);
      return {
        ...prevQuantities,
        [key]: newQuantity
      };
    });
  };

  return (
    <div>
      <Navbar />
      <div className="collection-wrapper">
        <div className="collection-leftNav">
          <ul>
            <li><a href="/collection">My Collection</a></li>
            <li><a href="/build-a-deck">Build A Deck</a></li>
            <li><a href="/all-cards">All Cards</a></li>
            <div className="collection-summary">
            <div>Total Value: ${calculateTotalPrice()}</div>
          </div>
          </ul>
        </div>

        <div className="collection-body">
          <h1>My Collection</h1>
          <div>
            <hr className="divider" />
          </div>

          <div className="col-search">
            <div className="col-search-bar">
              <input type="text" 
                id="col-card-search" 
                placeholder="Search for a card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>    
          </div>

          <div className="col-sortfilter">
            <div className="col-sortby">
              <p className="col-clickable" onClick={() => setShowSortingOptions(!showSortingOptions)}>
                  Sort By ▼
              </p>
              {showSortingOptions && (
                <div className={`col-sorting-options ${showSortingOptions ? 'open' : ''}`}>
                <ul>
                  <li onClick={() => setSortOption('name-asc')}>Card Name (A-Z)</li>
                  <li onClick={() => setSortOption('name-desc')}>Card Name (Z-A)</li>
                  <li onClick={() => setSortOption('number-asc')}>Card Number (Ascending)</li>
                  <li onClick={() => setSortOption('number-desc')}>Card Number (Descending)</li>
                </ul>
              </div>
              )}
            </div>

            <div className="col-filterby">
              <p className="col-clickable" onClick={() => setShowFilteringOptions(!showFilteringOptions)}>
                  Filter By ▼
              </p>

              {showFilteringOptions && (
                <div className="col-filtering-options">
                  <ul>
                    {/* Aspect Category */}
                    <li className="col-clickable" onClick={() => setShowAspectChoices(!showAspectChoices)}>Aspect ▼</li>
                    {showAspectChoices && (
                      <ul className="col-aspect-options">
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
                    <li className="col-clickable" onClick={() => setShowTypeChoices(!showTypeChoices)}>Type ▼</li>
                    {showTypeChoices && (
                      <ul className="col-type-options">
                        {/* Type Checkbox Options */}
                        {['Base', 'Event', 'Leader', 'Token Upgrade', 'Unit', 'Upgrade'].map(option => (
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
                    <li className="col-clickable" onClick={() => setShowCostChoices(!showCostChoices)}>Cost ▼</li>
                    {showCostChoices && (
                      <ul className="col-cost-options">
                        {/* Cost Checkbox Options */}
                        {['0', '1', '2', '3', '4', '5', '6', '7'].map(option => (
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
                    <li className="col-clickable" onClick={() => setShowSetChoices(!showSetChoices)}>Set ▼</li>
                    {showSetChoices && (
                      <ul className="col-set-options">
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

          <div className="col-active-filters">
            <div className="sorting-text-container">
              <p className="sorting-text">{getSortingText()}</p>
              {sortOption && (
                <button 
                  className="clear-button" 
                  onClick={() => {
                    setSortOption('name-asc');
                    setTimeout(() => {
                      setSortOption('');
                    }, 0);
                  }}
                >
                  X
                </button>
              )}
            </div>
            <div className="filtering-text-container">
              <p className="filtering-text">{getFilteringText()}</p>
              {(filters.aspects.length > 0 || filters.type.length > 0 || filters.cost.length > 0 || filters.set.length > 0) && (
                <button className="clear-button" onClick={() => setFilters({
                  aspects: [],
                  type: [],
                  cost: [],
                  set: []
                })}>
                  X
                </button>
              )}
            </div>          
          </div>

          {error && <div className="error">{error}</div>}

          <ul className="card-list">
            {filteredCards.map((card, index) => (
              <li key={index}>
                <div className="card-item">
                  {card.FrontArt ? (
                    <img
                      src={card.FrontArt}
                      alt={card.Name}
                      className="card-image"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                  {card.Name && <h2>{card.Name}</h2>}
                  {card.Aspects && <p>Aspect: {card.Aspects.join(', ')}</p>}
                  {card.Type && <p>Type: {card.Type}</p>}
                  {card.Cost !== undefined && <p>Cost: {card.Cost}</p>}
                  {card.Set && <p>Set: {card.Set}</p>}
                  {card.MarketPrice && <p>Price: ${card.MarketPrice}</p>}
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(card.Name, card.VariantType, false)}>-</button>
                    <span>{cardQuantities[`${card.Name}|${card.VariantType}`] || 0}</span>
                    <button onClick={() => handleQuantityChange(card.Name, card.VariantType, true)}>+</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Collection;