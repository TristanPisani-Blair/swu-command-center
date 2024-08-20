import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const DeckPage = () => {
  const { deckId } = useParams();

  return (
    <div>
      <Navbar />
      <div className="deck-page">
        <h1>Deck ID: {deckId}</h1>
        {/* Fetch and display the deck details here based on deckId */}
      </div>
      <Footer />
    </div>
  );
};

export default DeckPage;
