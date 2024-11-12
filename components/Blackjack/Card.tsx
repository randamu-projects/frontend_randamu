// Card.tsx
"use client";

import React from "react";

// Card.tsx

// Card.tsx

interface CardProps {
  value: string;
  suit: string;
}

const Card: React.FC<CardProps> = ({ value, suit }) => {
  // If value is 'back', display the face-down card image
  if (value === "back") {
    const backPath = `/cards/back.svg`;
    return <img src={backPath} alt="Card back" style={styles.cardImage} />;
  }

  // Otherwise, display the regular card
  const cardName = `${value}_of_${suit.toLowerCase()}`;
  const cardImagePath = `/cards/${cardName}.svg`; // Assuming images are in /public/cards/

  return <img src={cardImagePath} alt={`${value} of ${suit}`} style={styles.cardImage} />;
};

const styles = {
  cardImage: {
    width: "100px", // Adjust the size of the cards as needed
    height: "150px",
    margin: "5px",
    border: "1px solid black",
    borderRadius: "5px",
  },
};

export default Card;
