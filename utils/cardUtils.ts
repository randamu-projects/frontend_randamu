// src/utils/cardUtils.ts
export const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
export const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

//! ICI ON APPELLERA LES CONTRATS POUR LA RANDOMNESS
// Function to create and shuffle a deck
export const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ value, suit });
    }
  }
  return deck.sort(() => Math.random() - 0.5); // Shuffle the deck
};

export const getCardValue = (card: Card | undefined): number => {
  if (!card) {
    return 0; // Or throw an error if this should never happen
  }
  const faceCards = ["J", "Q", "K"];
  if (faceCards.includes(card.value)) {
    return 10;
  } else if (card.value === "A") {
    return 11;
  } else {
    return parseInt(card.value, 10);
  }
};

// Function to calculate the total value of a hand
export const calculateTotal = (hand: { value: string }[]) => {
  let total = hand.reduce((acc, card) => acc + getCardValue(card), 0);
  let aceCount = hand.filter(card => card.value === "A").length;

  // If total is over 21 and there's an Ace, count Ace as 1 instead of 11
  while (total > 21 && aceCount > 0) {
    total -= 10; // Count Ace as 1 instead of 11
    aceCount--;
  }

  return total;
};
