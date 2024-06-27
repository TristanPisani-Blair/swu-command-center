import React, { useState, useEffect } from "react";
import './CardList.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const CardList = () => {
  const [cards, setCards] = useState([]);
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

  return (
    <div>
      <Navbar />
      <div className="wrapper">
        <div className="cardlist-leftNav">
          <ul>
            <li><a href="/collection">My Collection</a></li>
            <li><a href="/test">Build A Deck</a></li>
            <li><a href="/cardlist">Card List</a></li>
          </ul>
        </div>

        <div className="cardlist-body">
          <h1>Database</h1>
          <div>
            <hr className="divider" />
          </div>

          {error && <div className="error">{error}</div>}

          <div className="card-list">
            {cards.map((card, index) => {
              const isHorizontal = card.type === 'Leader' || card.type === 'Base';
              return (
                <div key={card.id || index} className={`card-item ${isHorizontal ? 'horizontal' : ''}`}>
                  {card.FrontArt ? (
                    <>
                      <img
                        src={card.FrontArt}
                        alt={card.name}
                        className="card-image"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      {console.log(`Image URL for ${card.name}: ${card.FrontArt}`)}
                    </>
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                  {card.name && <h2>{card.name}</h2>}
                  {card.aspects && <p>Aspect: {card.aspects.join(', ')}</p>}
                  {card.type && <p>Type: {card.type}</p>}
                  {card.cost !== undefined && <p>Cost: {card.cost}</p>}
                  {card.set && <p>Set: {card.set}</p>}
                  {card.MarketPrice && <p>Price: ${card.MarketPrice}</p>} {/* New line for market price */}
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
