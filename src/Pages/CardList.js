import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './CardList.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const CardList = () => {
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
  });  const [filteredCards, setFilteredCards] = useState(cards);
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
  
  return (
    <div>
      <Navbar />
      <div className="cardlist-wrapper">
        <div className="cardlist-leftNav">
          <ul>
            <li><a href="/collection">My Collection</a></li>
            <li><a href="/test">Build A Deck</a></li>
            <li><a href="/cardlist">All Cards</a></li>
          </ul>
        </div>

        <div className="cardlist-body">
          <h1>All Cards</h1>
          <div>
            <hr className="divider" />
          </div>

          <div className="cl-search">
            <div className="cl-search-bar">
              <input type="text" 
                id="cl-card-search" 
                placeholder="Search for a card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>    
          </div>

          <div className="cl-sortfilter">
            <div className="cl-sortby">
              <p className="cl-clickable" onClick={() => setShowSortingOptions(!showSortingOptions)}>
                  Sort By ▼
              </p>
              {showSortingOptions && (
                <div className={`cl-sorting-options ${showSortingOptions ? 'open' : ''}`}>
                <ul>
                  <li onClick={() => setSortOption('name-asc')}>Card Name (A-Z)</li>
                  <li onClick={() => setSortOption('name-desc')}>Card Name (Z-A)</li>
                  <li onClick={() => setSortOption('number-asc')}>Card Number (Ascending)</li>
                  <li onClick={() => setSortOption('number-desc')}>Card Number (Descending)</li>
                </ul>
              </div>
              )}
            </div>

            <div className="cl-filterby">
              <p className="cl-clickable" onClick={() => setShowFilteringOptions(!showFilteringOptions)}>
                  Filter By ▼
              </p>

              {showFilteringOptions && (
                <div className="cl-filtering-options">
                  <ul>
                    {/* Aspect Category */}
                    <li className="cl-clickable" onClick={() => setShowAspectChoices(!showAspectChoices)}>Aspect ▼</li>
                    {showAspectChoices && (
                      <ul className="cl-aspect-options">
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
                    <li className="cl-clickable" onClick={() => setShowTypeChoices(!showTypeChoices)}>Type ▼</li>
                    {showTypeChoices && (
                      <ul className="cl-type-options">
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
                    <li className="cl-clickable" onClick={() => setShowCostChoices(!showCostChoices)}>Cost ▼</li>
                    {showCostChoices && (
                      <ul className="cl-cost-options">
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
                    <li className="cl-clickable" onClick={() => setShowSetChoices(!showSetChoices)}>Set ▼</li>
                    {showSetChoices && (
                      <ul className="cl-set-options">
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
            <p className="sorting-text">{getSortingText()}</p>
            <p className="filtering-text">{getFilteringText()}</p>
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
                      {/*
                      {card.Aspects && <p>Aspect: {card.Aspects.join(', ')}</p>}
                      {card.Type && <p>Type: {card.Type}</p>}
                      {card.Cost !== undefined && <p>Cost: {card.Cost}</p>}
                      {card.Set && <p>Set: {card.Set}</p>}
                      {card.MarketPrice && <p>Price: ${card.MarketPrice}</p>}
                      */}
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

export default CardList;
