import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Collection.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import CardItem from '../Components/CardItem';
import Filters from '../Components/Filters';
import searchIMG from '../Components/Assets/search.png';

const Collection = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    aspects: [],
    types: [],
    costs: [],
  });

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('/api/cards/sor?format=json&pretty=true');
        setCards(response.data.data);
        setFilteredCards(response.data.data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    let tempCards = [...cards];
    
    if (searchTerm) {
      tempCards = tempCards.filter(card =>
        card.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.aspects.length > 0) {
      tempCards = tempCards.filter(card =>
        filters.aspects.every(filter =>
          card.aspects.includes(filter)
        )
      );
    }

    if (filters.types.length > 0) {
      tempCards = tempCards.filter(card =>
        filters.types.includes(card.type)
      );
    }

    if (filters.costs.length > 0) {
      tempCards = tempCards.filter(card =>
        filters.costs.includes(card.cost.toString())
      );
    }

    setFilteredCards(tempCards);
  }, [searchTerm, filters, cards]);

  const handleCheckboxChange = (category, itemName) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (newFilters[category].includes(itemName)) {
        newFilters[category] = newFilters[category].filter(filter => filter !== itemName);
      } else {
        newFilters[category] = [...newFilters[category], itemName];
      }
      return newFilters;
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="collection-body">
          <h1>My Collection</h1>
          <div>
            <hr className="divider" />
          </div>

          <div className="collection-search">
            <p className="collection-value">Collection Value: </p>
            <div className="search-bar">
              <input
                type="text"
                id="card-search"
                placeholder="Search for a card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Filters filters={filters} handleCheckboxChange={handleCheckboxChange} />

          <div className="card-list">
            {filteredCards.map((card, index) => (
              <CardItem key={index} card={card} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Collection;
