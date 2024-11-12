// Hand.tsx
"use client";

import React from "react";
import { calculateTotal } from "../../utils/cardUtils";
import Card from "./Card";

// Hand.tsx

interface CardType {
  value: string;
  suit: string;
}

interface HandProps {
  hand: CardType[];
  title: string;
  hidden?: boolean; // Used to hide the dealer's first card
  gameOver?: boolean; // When the game is over, all cards are revealed
}

const Hand: React.FC<HandProps> = ({ hand, title, hidden = false, gameOver = false }) => {
  return (
    <div style={styles.hand}>
      <h2>
        {title}: {!hidden && calculateTotal(hand)}
      </h2>
      <div style={styles.cards}>
        {hand.map((card, index) => (
          <Card
            key={index}
            value={hidden && index === 0 && !gameOver ? "back" : card.value} // Show the back for the first card if hidden
            suit={hidden && index === 0 && !gameOver ? "" : card.suit} // Don't need suit for card back
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  hand: {
    margin: "1rem",
    textAlign: "center" as const,
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
};

export default Hand;
