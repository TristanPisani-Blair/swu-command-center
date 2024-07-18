import React, { useState } from "react";
import './Collection.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import searchIMG from '../Components/Assets/search.png';


const Collection = () => {
  const [showSortingOptions, setShowSortingOptions] = useState(false);
  const [showFilteringOptions, setShowFilteringOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [showAspectChoices, setShowAspectChoices] = useState(false);
  const [showTypeChoices, setShowTypeChoices] = useState(false);
  const [showCostChoices, setShowCostChoices] = useState(false);
  const [showSetChoices, setShowSetChoices] = useState(false);

  const handleCheckboxChange = (itemName) => {
    if (selectedFilters.includes(itemName)) {
        setSelectedFilters(selectedFilters.filter(filter => filter !== itemName));
    } else {
        setSelectedFilters([...selectedFilters, itemName]);
    }
  };

    return (
      <div>
        <Navbar />

        <div className="container" class="collection-wrapper">
          <div className="collection-leftNav">
            <ul>
              <li><a href="/Collection">My Collection</a></li>
              <li><a href="#BuildADeck">Build A Deck</a></li>
              <li><a href="/CardList">Card List</a></li>
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
                <input type="text" id="card-search" placeholder="Search for a card" />
                <button type="button" className="search-button">
                  <img src={searchIMG} alt="Search" className="search" />
                </button>
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
              <div className="sortby">
                <p className="clickable" onClick={() => setShowSortingOptions(!showSortingOptions)}>
                    Sort By ▼
                </p>
                {showSortingOptions && (
                  <div className="sorting-options">
                    <ul>
                      <li>Card Name (A-Z)</li>
                      <li>Card Name (Z-A)</li>
                      <li>Card Number (Ascending)</li>
                      <li>Card Number (Descending)</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="filterby">
                <p className="clickable" onClick={() => setShowFilteringOptions(!showFilteringOptions)}>
                    Filter By ▼
                </p>
                {showFilteringOptions && (
                  <div className="filtering-options">
                    <ul>
                      <li className="clickable" onClick={() => setShowAspectChoices(!showAspectChoices)}>Aspect ▼</li>
                        {showAspectChoices && (
                          <div className="aspect-options">
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

                      <li className="clickable" onClick={() => setShowTypeChoices(!showTypeChoices)}>Type ▼</li>
                        {showTypeChoices && (
                          <div className="type-options">
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

                      <li className="clickable" onClick={() => setShowCostChoices(!showCostChoices)}>Cost ▼</li>
                        {showCostChoices && (
                          <div className="cost-options">
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

                      <li className="clickable" onClick={() => setShowSetChoices(!showSetChoices)}>Set ▼</li>
                        {showSetChoices && (
                          <div className="set-options">
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
          </div>

        </div>

        <Footer />
      </div>
    );
  }
  
  export default Collection;
