import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CardPage.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const CardPage = () => {
    const { number, name } = useParams();
    const [card, setCard] = useState(null); // Individual Card
    const [cards, setCards] = useState([]); // Full list
    const [error, setError] = useState(null);

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

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!card) {
        return <div>Loading...</div>;
    }

    return (
        <div>
          <Navbar />

            <div className="cardpage-container" class="wrapper">
                <div className="cardpage-leftNav">
                    <ul>
                        <li><a href="/collection">My Collection</a></li>
                        <li><a href="/test">Build A Deck</a></li>
                        <li><a href="/cardlist">All Cards</a></li>
                    </ul>
                </div>

                <div className="cardpage-body">
                    <h1>{card.Name}</h1>
                    <div>
                        <hr className="divider" />
                    </div>
                    <div className="cp-info-section">
                        <img className="cp-card-image" src={card.FrontArt} />
                        <div className='cp-card-info'>
                            <p>{card.FrontText}</p>
                            <div className='card-info-sides'>
                                <div className='card-left-info'>
                                    <p>Aspect(s): {card.Aspects && Array.isArray(card.Aspects) ? card.Aspects.join(', ') : 'N/A'}</p>
                                    <p>Arena(s): {card.Arena && Array.isArray(card.Arena) ? card.Arena.join(', ') : 'N/A'}</p>
                                    <p>Cost: {card.Cost !== undefined && card.Cost !== null ? card.Cost : 'N/A'}</p>
                                    <p>Power: {card.Power !== undefined && card.Power !== null ? card.Power : 'N/A'}</p>
                                    <p>HP: {card.HP !== undefined && card.HP !== null ? card.HP : 'N/A'}</p>
                                    <p>Rarity: {card.Rarity !== undefined && card.Rarity !== null ? card.Rarity : 'N/A'}</p>
                                </div>
                                <div className='card-right-info'>
                                    <p>Set: {card.Set !== undefined && card.Set !== null ? card.Set : 'N/A'}</p>
                                    <p>Type(s): {card.Type && Array.isArray(card.Type) ? card.Type.join(', ') : 'N/A'}</p>
                                    <p>Trait(s): {card.Traits && Array.isArray(card.Traits) ? card.Traits.join(', ') : 'N/A'}</p>
                                    <p>Artist: {card.Artist !== undefined && card.Artist !== null ? card.Artist : 'N/A'}</p>
                                    <p>Card Number: {card.Number !== undefined && card.Number !== null ? card.Number : 'N/A'}</p>
                                    <p>Varient Type: {card.VarientType !== undefined && card.VarientType !== null ? card.VarientType : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          <Footer />
        </div>
      );
    }
    
export default CardPage;