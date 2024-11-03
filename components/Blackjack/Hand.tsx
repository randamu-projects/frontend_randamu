import React from "react";
import { styles } from "../../styles/Hand";
import { calculateTotal } from "../../utils/cardUtils";
import Card from "./Card";

interface HandProps {
  hand: { value: string; suit: string }[];
  title: string;
  hidden?: boolean; // Used to hide the dealer's first card
  gameOver?: boolean; // When game is over, all cards are revealed
}

const Hand: React.FC<HandProps> = ({ hand, title, hidden, gameOver = false }) => {
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
            suit={hidden && index === 0 && !gameOver ? "" : card.suit} // Don't need suit for card-back
          />
        ))}
      </div>
    </div>
  );
};

export default Hand;
