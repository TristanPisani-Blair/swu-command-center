import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CardPage.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const CardPage = () => {
    const { number, name } = useParams();
    const [card, setCard] = useState(null); // Individual Card
    const [cards, setCards] = useState([]); // Full list
    const [relatedCards, setRelatedCards] = useState([]);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);
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

    // Find and set the specific card based on URL params
    useEffect(() => {
        if (cards.length > 0) {
        const foundCard = cards.find(card => 
            card.Number === decodeURIComponent(number) && card.Name === decodeURIComponent(name)
        );
        setCard(foundCard);
        }
    }, [cards, number, name]);

    // Find 10 random cards of the same type to display
    useEffect(() => {
      if (card && card.Type) {
        // Filter cards based on type and exclude the current card
        const filteredCards = cards.filter(c => c.Type === card.Type && c.Number !== card.Number);
  
        const shuffleArray = (array) => {
          let currentIndex = array.length, randomIndex;
          while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
          }
          return array;
        };
  
        const shuffledCards = shuffleArray(filteredCards);
  
        const randomCards = shuffledCards.slice(0, 10);
  
        setRelatedCards(randomCards);
      }
    }, [card, cards]);

    const scrollLeft = () => {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    };
  
    const scrollRight = () => {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    };

    const handleCardClick = (card) => {
      const cardNumber = encodeURIComponent(card.Number);
      const cardName = encodeURIComponent(card.Name);
      navigate(`/card/${cardNumber}/${cardName}`);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    {/*
    if (!card) {
        return <div>Loading...</div>;
    }
    */}

    return (
      <div>
        <Navbar />

          <div className="cardpage-container" class="wrapper">
            <div className="cardpage-leftNav">
              <ul>
                <li><a href="/collection">My Collection</a></li>
                <li><a href="/build-a-deck">Build A Deck</a></li>
                <li><a href="/all-cards">All Cards</a></li>
              </ul>
            </div>

            <div className="cardpage-body">
              <h1>{card ? card.Name : 'Loading...'}</h1>
                <div>
                  <hr className="divider" />
                </div>

              {card && (
                <div className="cp-info-section">
                  <img className="cp-card-image" src={card.FrontArt} alt={card.Name} />    
                  <h2 className='cp-market-price'>Current market price: ${card.MarketPrice}</h2>
                    <div className='cp-card-info'>
                      <p className='cp-front-text'><strong>{card.FrontText}</strong></p>
                        <div className='card-info-sides'>
                          <div className='card-left-info'>
                            <p>Aspect(s): {Array.isArray(card.Aspects) ? card.Aspects.join(', ') : card.Aspects || 'N/A'}</p>
                            <p>Arena(s): {Array.isArray(card.Arenas) ? card.Arenas.join(', ') : card.Arenas || 'N/A'}</p>
                            <p>Cost: {card.Cost !== undefined && card.Cost !== null ? card.Cost : 'N/A'}</p>
                            <p>Power: {card.Power !== undefined && card.Power !== null ? card.Power : 'N/A'}</p>
                            <p>HP: {card.HP !== undefined && card.HP !== null ? card.HP : 'N/A'}</p>
                            <p>Rarity: {card.Rarity !== undefined && card.Rarity !== null ? card.Rarity : 'N/A'}</p>
                          </div>

                          <div className='card-right-info'>
                            <p>Set: {card.Set !== undefined && card.Set !== null ? card.Set : 'N/A'}</p>
                            <p>Trait(s): {Array.isArray(card.Traits) ? card.Traits.join(', ') : card.Traits || 'N/A'}</p>
                            <p>Type(s): {Array.isArray(card.Type) ? card.Type.join(', ') : card.Type || 'N/A'}</p>                                    
                            <p>Artist: {card.Artist !== undefined && card.Artist !== null ? card.Artist : 'N/A'}</p>
                            <p>Card Number: {card.Number !== undefined && card.Number !== null ? card.Number : 'N/A'}</p>
                            <p>Varient Type: {card.VariantType !== undefined && card.VariantType !== null ? card.VariantType : 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className='cp-related-cards'>
                        <h2>Related Cards</h2>
                          <div>
                            <hr className="divider" />
                          </div>

                          {relatedCards.length > 0 && (
                            <div className="scroll-container">
                              <button className="scroll-arrow left-arrow" onClick={scrollLeft}>&lt;</button>
                              <div className="related-cards-wrapper">
                                <div className="related-cards-container" ref={scrollContainerRef}>
                                  {relatedCards.map((relatedCard, index) => {
                                    const isHorizontal = relatedCard.type === 'Leader' || relatedCard.type === 'Base';

                                    return (
                                      <div 
                                        key={relatedCard.id || index} 
                                        className={`related-card ${isHorizontal ? 'horizontal' : ''}`}
                                        onClick={() => handleCardClick(relatedCard)}
                                      >
                                        <div className="related-card-image-div">
                                          {relatedCard.FrontArt ? (
                                            <img
                                              src={relatedCard.FrontArt}
                                              alt={relatedCard.Name}
                                              className="related-card-image"
                                              onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                          ) : (
                                            <div className="related-card-placeholder-image"></div>
                                          )}
                                        </div>
                                        <div className="related-card-info">
                                          {relatedCard.Name && <h2>{relatedCard.Name}</h2>}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <button className="scroll-arrow right-arrow" onClick={scrollRight}>&gt;</button>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

            </div>
          </div>

          <Footer />
        </div>
      );
    }
    
export default CardPage;