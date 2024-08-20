import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Collection.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import searchIMG from '../Components/Assets/search.png';


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
  const [showAspectChoices, setShowAspectChoices] = useState(false);
  const [showTypeChoices, setShowTypeChoices] = useState(false);
  const [showCostChoices, setShowCostChoices] = useState(false);
  const [showSetChoices, setShowSetChoices] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      {/* Need to add function to pull deck data by user ID 
        and only display cards*/}
    };

    fetchCards();
  }, []);

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

    return (
      <div>
        <Navbar />

        <div className="container" class="collection-wrapper">
          <div className="collection-leftNav">
            <ul>
              <li><a href="/Collection">My Collection</a></li>
              <li><a href="#BuildADeck">Build A Deck</a></li>
              <li><a href="/CardList">All Cards</a></li>
            </ul>
          </div>

          <div className="collection-body">
            <h1>My Collection</h1>
            <div>
              <hr className="divider" />
            </div>

            <div className="collection-search">
              <p className="collection-value">Collection Value: </p>
              <div className="search-bar">
                <input type="text" 
                  id="card-search" 
                  placeholder="Search for a card"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>    

                <div className="collection-view">
                  <p>View:</p>
                  <div className="collection-form-group-checkbox">
                    <input type="checkbox" id="cards-checkbox" name="cards-checkbox" />
                    <p>Cards</p>
                  </div>
                  <div className="collection-form-group-checkbox">
                    <input type="checkbox" id="decks-checkbox" name="decks-checkbox" />
                    <p>Decks</p>
                  </div>
                </div>
            </div>

            <div className="collection-sortfilter">
              <div className="collection-sortby">
                <p className="collection-clickable" onClick={() => setShowSortingOptions(!showSortingOptions)}>
                    Sort By ▼
                </p>
                {showSortingOptions && (
                  <div className={`collection-sorting-options ${showSortingOptions ? 'open' : ''}`}>
                  <ul>
                    <li onClick={() => setSortOption('name-asc')}>Card Name (A-Z)</li>
                    <li onClick={() => setSortOption('name-desc')}>Card Name (Z-A)</li>
                    <li onClick={() => setSortOption('number-asc')}>Card Number (Ascending)</li>
                    <li onClick={() => setSortOption('number-desc')}>Card Number (Descending)</li>
                  </ul>
                </div>
                )}
              </div>

              <div className="collection-filterby">
                <p className="collection-clickable" onClick={() => setShowFilteringOptions(!showFilteringOptions)}>
                    Filter By ▼
                </p>

                {showFilteringOptions && (
                  <div className="collection-filtering-options">
                    <ul>
                      {/* Aspect Category */}
                      <li className="collection-clickable" onClick={() => setShowAspectChoices(!showAspectChoices)}>Aspect ▼</li>
                      {showAspectChoices && (
                        <ul className="collection-aspect-options">
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
                      <li className="collection-clickable" onClick={() => setShowTypeChoices(!showTypeChoices)}>Type ▼</li>
                      {showTypeChoices && (
                        <ul className="collection-type-options">
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
                      <li className="collection-clickable" onClick={() => setShowCostChoices(!showCostChoices)}>Cost ▼</li>
                      {showCostChoices && (
                        <ul className="collection-cost-options">
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
                      <li className="collection-clickable" onClick={() => setShowSetChoices(!showSetChoices)}>Set ▼</li>
                      {showSetChoices && (
                        <ul className="collection-set-options">
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

            <div className="cl-active-filters">
              <div className="sorting-text-container">
                <p className="sorting-text">{getSortingText()}</p>
                {sortOption && (
                  <button className="clear-button" onClick={() => setSortOption('')}>
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

            <div className="cl-card-list">
                {sortedAndFilteredCards.map((card, index) => {
                  const isHorizontal = card.type === 'Leader' || card.type === 'Base';
                  return (
                    <div 
                      key={card.id || index} 
                      className={`cl-card-item ${isHorizontal ? 'horizontal' : ''}`}
                      onClick={() => handleCardClick(card)}
                      >
                      <div className="cl-card-image-div">
                      {card.FrontArt ? (
                        <>
                          <img
                            src={card.FrontArt}
                            alt={card.Name}
                            className="cl-card-image"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </>
                      ) : (
                        <div className="cl-placeholder-image"></div>
                      )}
                      </div>
                      <div className="cl-card-info">
                        {card.Name && <h2>{card.Name}</h2>}
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        </div>

        <Footer />
      </div>
    );
  }
  
  export default Collection;
