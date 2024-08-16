import React from 'react';
import './Filters.css';

const Filters = ({ filters, handleCheckboxChange }) => {
  return (
    <div className="filters">
      <h3>Filter By</h3>
      <div className="filter-category">
        <h4>Aspect</h4>
        {['Aggression', 'Command', 'Cunning', 'Heroism', 'Vigilance', 'Villainy'].map((aspect) => (
          <div key={aspect} className="filter-option">
            <input
              type="checkbox"
              id={aspect}
              value={aspect}
              checked={filters.aspects.includes(aspect)}
              onChange={() => handleCheckboxChange('aspects', aspect)}
            />
            <label htmlFor={aspect}>{aspect}</label>
          </div>
        ))}
      </div>
      <div className="filter-category">
        <h4>Type</h4>
        {['Base', 'Event', 'Leader', 'Token Upgrade', 'Unit', 'Upgrade'].map((type) => (
          <div key={type} className="filter-option">
            <input
              type="checkbox"
              id={type}
              value={type}
              checked={filters.types.includes(type)}
              onChange={() => handleCheckboxChange('types', type)}
            />
            <label htmlFor={type}>{type}</label>
          </div>
        ))}
      </div>
      <div className="filter-category">
        <h4>Cost</h4>
        {['0', '1', '2', '3', '4', '5', '6', '7'].map((cost) => (
          <div key={cost} className="filter-option">
            <input
              type="checkbox"
              id={cost}
              value={cost}
              checked={filters.costs.includes(cost)}
              onChange={() => handleCheckboxChange('costs', cost)}
            />
            <label htmlFor={cost}>{cost}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;