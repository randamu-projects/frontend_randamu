// BlackJackGetHand.tsx
"use client";

import React from "react";
import Hand from "./Hand";
import { useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

// BlackJackGetHand.tsx

interface BlackJackGetHandProps {
  gameId: string; // The game ID as a hex string
  actor: number; // The actor (e.g., 0 for Player, 1 for Dealer)
  hidden?: boolean; // For hiding dealer's first card
  gameOver?: boolean; // Indicates if the game is over
}

const BlackJackGetHand: React.FC<BlackJackGetHandProps> = ({ gameId, actor, hidden = false, gameOver = false }) => {
  // Use the useReadContract hook to call the getCards function

  const blackJackContractInfo = deployedContracts[31337].Blackjack;
  const blackjackContractAddress = blackJackContractInfo.address;
  const blackjackContractABI = blackJackContractInfo.abi;

  const { data } = useReadContract({
    address: blackjackContractAddress,
    abi: blackjackContractABI,
    functionName: "getCards",
    chainId: 31337,
    args: [gameId, actor],
  });

  // data is an array of uint8 values representing cards
  const cards = data as number[];

  function getShuffledSuits() {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    for (let i = suits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [suits[i], suits[j]] = [suits[j], suits[i]];
    }
    return suits;
  }

  // Function to map uint8 values to card representations
  const mapCardValueToCard = (cardValue: number) => {
    // Assuming cardValue ranges from 0 to 13, representing a standard deck
    const suits = getShuffledSuits();

    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    const suitIndex = Math.floor((cardValue * 4) / 13);

    const valueIndex = cardValue % 13;

    const suit = suits[suitIndex];
    const value = values[valueIndex];

    return { value, suit };
  };

  // Map the card values to an array of { value, suit }
  let hand: { value: string; suit: string }[];
  if (cards === undefined) {
    hand = [];
  } else {
    hand = cards.length !== 0 ? cards.map(mapCardValueToCard) : [];
  }

  // Determine the title based on actor
  const title = actor === 0 ? "Player Hand" : "Dealer Hand";
  console.log("Hand: ", hand);

  return <Hand hand={hand} title={title} hidden={hidden} gameOver={gameOver} />;
};

export default BlackJackGetHand;
