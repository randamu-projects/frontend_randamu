// src/components/Deck.ts
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
const values = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
]

// Function to create and shuffle a deck
export const createDeck = () => {
  const deck = []
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ value, suit })
    }
  }
  return deck.sort(() => Math.random() - 0.5) // Shuffle the deck
}

// Function to get the numeric value of a card
export const getCardValue = (card: { value: string }) => {
  if (['J', 'Q', 'K'].includes(card.value)) return 10
  if (card.value === 'A') return 11 // Ace can be 11 (or 1, but we'll handle that logic separately)
  return parseInt(card.value)
}

// Function to calculate the total value of a hand
export const calculateTotal = (hand: { value: string }[]) => {
  let total = hand.reduce((acc, card) => acc + getCardValue(card), 0)
  let aceCount = hand.filter((card) => card.value === 'A').length

  // If total is over 21 and there's an Ace, count Ace as 1 instead of 11
  while (total > 21 && aceCount > 0) {
    total -= 10 // Count Ace as 1 instead of 11
    aceCount--
  }

  return total
}
