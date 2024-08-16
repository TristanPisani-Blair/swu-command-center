import React from 'react';
import './CardItem.css';

const CardItem = ({ card }) => {
  return (
    <div className="card-item">
      <div className="card-img">
        <img src={card.FrontArt} alt={`Card: ${card.Name}`} />
      </div>
      <div className="card-info">
        <h3>{card.Name}</h3>
        <p>Set: {card.Set}</p>
        <p>Number: {card.Number}</p>
        <p>Type: {card.type}</p>
        <p>Aspect: {card.aspects.join(', ')}</p>
        <p>Cost: {card.cost}</p>
        <p>Power: {card.power}</p>
        <p>HP: {card.hp}</p>
        <p>Rarity: {card.rarity}</p>
        <p>Price: ${card.MarketPrice}</p>
      </div>
    </div>
  );
};

export default CardItem;