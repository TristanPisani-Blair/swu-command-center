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
  const [selectedFilters, setSelectedFilters] = useState([]);
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

  const handleCheckboxChange = (itemName) => {
    if (selectedFilters.includes(itemName)) {
        setSelectedFilters(selectedFilters.filter(filter => filter !== itemName));
    } else {
        setSelectedFilters([...selectedFilters, itemName]);
    }
  };

  // Search function to filter cards by user input
  const filteredCards = cards.filter(card =>
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
  const sortedAndFilteredCards = sortCards(filteredCards);

  const handleCardClick = (card) => {
    const cardNumber = encodeURIComponent(card.Number);
    const cardName = encodeURIComponent(card.Name);
    navigate(`/card/${cardNumber}/${cardName}`);
  };
  
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
                    <li className="cl-clickable" onClick={() => setShowAspectChoices(!showAspectChoices)}>Aspect ▼</li>
                      {showAspectChoices && (
                        <div className="cl-aspect-options">
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

                    <li className="cl-clickable" onClick={() => setShowTypeChoices(!showTypeChoices)}>Type ▼</li>
                      {showTypeChoices && (
                        <div className="cl-type-options">
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

                    <li className="cl-clickable" onClick={() => setShowCostChoices(!showCostChoices)}>Cost ▼</li>
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

                    <li className="cl-clickable" onClick={() => setShowSetChoices(!showSetChoices)}>Set ▼</li>
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
