// BlackjackGame.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { styles } from "../../styles/BlackJackGameStyles";
import { calculateTotal, createDeck } from "../../utils/cardUtils";
import Hand from "../Blackjack/Hand";
import BlackjackGameInt from "./BlackjackGameInt";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// BlackjackGame.tsx

// BlackjackGame.tsx

// BlackjackGame.tsx

// BlackjackGame.tsx

// BlackjackGame.tsx

interface Card {
  value: string;
  suit: string;
}

interface GameState {
  deck: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  gameOver: boolean;
  message: string;
  bet: string;
  playerTotal: number;
  dealerTotal: number;
  isDealerDrawing: boolean;
}

const BlackjackGame: React.FC = () => {
  const router = useRouter();
  const [userBalance, setUserBalance] = useState(1000);
  const [, setDealerBalance] = useState(1000000);
  const [gameStates, setGameStates] = useState<Record<number, GameState>>({});

  // Updated nonce state to manage input value and parsed number
  const [nonceInputValue, setNonceInputValue] = useState<string>("");
  const [nonce, setNonce] = useState<number>(0);

  const [currentGameState, setCurrentGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (nonce !== undefined) {
      if (gameStates[nonce]) {
        setCurrentGameState(gameStates[nonce]);
      } else {
        const initialGameState: GameState = {
          deck: createDeck(),
          playerHand: [],
          dealerHand: [],
          gameOver: true,
          message: "",
          bet: "",
          playerTotal: 0,
          dealerTotal: 0,
          isDealerDrawing: false,
        };
        setGameStates(prev => ({ ...prev, [nonce]: initialGameState }));
        setCurrentGameState(initialGameState);
      }
    }
  }, [nonce]);

  useEffect(() => {
    if (nonce !== undefined && currentGameState) {
      setGameStates(prev => ({ ...prev, [nonce]: currentGameState }));
    }
  }, [nonce, currentGameState]);

  useEffect(() => {
    if (currentGameState) {
      setCurrentGameState(prev => prev && { ...prev, playerTotal: calculateTotal(prev.playerHand) });
    }
  }, [currentGameState?.playerHand]);

  useEffect(() => {
    if (currentGameState) {
      setCurrentGameState(prev => prev && { ...prev, dealerTotal: calculateTotal(prev.dealerHand) });
    }
  }, [currentGameState?.dealerHand]);

  const handleBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBet = event.target.value;
    setCurrentGameState(prev => prev && { ...prev, bet: newBet });
  };

  // Updated to parse bet as float when needed
  const val = parseFloat(currentGameState?.bet || "0");

  const startGame = () => {
    if (userBalance < val) {
      setCurrentGameState(prev => prev && { ...prev, message: "You don't have enough money to place this bet!" });
      return;
    }

    if (val <= 0) {
      setCurrentGameState(prev => prev && { ...prev, message: "Invalid bet" });
      return;
    }

    if (Number.isNaN(val)) {
      setCurrentGameState(prev => prev && { ...prev, message: "Enter a valid bet" });
      return;
    }

    setUserBalance(prev => prev - val);
    setDealerBalance(prev => prev + val);

    let deckCopy = [...(currentGameState?.deck || [])];
    if (deckCopy.length < 10) {
      deckCopy = createDeck();
      setCurrentGameState(prev => prev && { ...prev, message: "Deck is reshuffled!" });
    }

    const newPlayerHand = [deckCopy.pop()!, deckCopy.pop()!];
    const newDealerHand = [deckCopy.pop()!, deckCopy.pop()!];

    setCurrentGameState(
      prev =>
        prev && {
          ...prev,
          deck: deckCopy,
          playerHand: newPlayerHand,
          dealerHand: newDealerHand,
          gameOver: false,
          message: "",
        },
    );
  };

  const startNextHand = () => {
    if (userBalance < val) {
      setCurrentGameState(prev => prev && { ...prev, message: "You don't have enough funds to cover the bet!" });
      return;
    }
    startGame();
  };

  const handleBack = () => {
    router.push("/");
  };

  const playerHit = () => {
    if ((currentGameState?.deck || []).length === 0) {
      setCurrentGameState(prev => prev && { ...prev, message: "No more cards in the deck!" });
      return;
    }

    const deckCopy = [...(currentGameState?.deck || [])];
    const newPlayerHand = [...(currentGameState?.playerHand || []), deckCopy.pop()!];

    setCurrentGameState(
      prev =>
        prev && {
          ...prev,
          playerHand: newPlayerHand,
          deck: deckCopy,
        },
    );

    const newTotal = calculateTotal(newPlayerHand);
    if (newTotal > 21) {
      setCurrentGameState(
        prev =>
          prev && {
            ...prev,
            gameOver: true,
            message: "You bust! Dealer wins.",
          },
      );
      handleLoss();
    } else if (newTotal === 21) {
      setCurrentGameState(
        prev =>
          prev && {
            ...prev,
            gameOver: true,
            message: "You hit 21! You win!",
          },
      );
      handleWin(newTotal);
    }
  };

  const playerStand = async () => {
    setCurrentGameState(prev => prev && { ...prev, isDealerDrawing: true });
    const deckCopy = [...(currentGameState?.deck || [])];
    const newDealerHand = [...(currentGameState?.dealerHand || [])];

    while (calculateTotal(newDealerHand) < 17 && deckCopy.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCard = deckCopy.pop()!;
      newDealerHand.push(newCard);
      setCurrentGameState(
        prev =>
          prev && {
            ...prev,
            dealerHand: [...newDealerHand],
            deck: deckCopy,
          },
      );
    }

    setCurrentGameState(prev => prev && { ...prev, isDealerDrawing: false });

    const currentPlayerTotal = calculateTotal(currentGameState?.playerHand || []);
    const currentDealerTotal = calculateTotal(newDealerHand);

    if (currentDealerTotal > 21) {
      setCurrentGameState(prev => prev && { ...prev, message: "Dealer busts! You win!" });
      handleWin(currentPlayerTotal);
    } else if (currentPlayerTotal > currentDealerTotal) {
      setCurrentGameState(prev => prev && { ...prev, message: "You win!" });
      handleWin(currentPlayerTotal);
    } else if (currentDealerTotal > currentPlayerTotal) {
      setCurrentGameState(prev => prev && { ...prev, message: "Dealer wins." });
      handleLoss();
    } else {
      setCurrentGameState(prev => prev && { ...prev, message: "It's a tie!" });
      setUserBalance(prev => prev + val);
      setDealerBalance(prev => prev - val);
    }

    setCurrentGameState(prev => prev && { ...prev, gameOver: true });
  };

  const handleWin = (playerTotal: number) => {
    let winnings = val;
    if (playerTotal === 21) {
      winnings = val * 2;
    } else {
      winnings = val * 1.5;
    }

    setUserBalance(prev => prev + winnings);
    setDealerBalance(prev => prev - winnings);
  };

  const handleLoss = () => {
    // Handle loss (if needed)
  };

  const calculateVisibleDealerTotal = () => {
    if (currentGameState?.gameOver) {
      return currentGameState?.dealerTotal || 0;
    } else {
      const dealerHand = currentGameState?.dealerHand || [];
      if (dealerHand.length > 1 && dealerHand[1]) {
        return calculateTotal([dealerHand[1]]);
      } else {
        return 0;
      }
    }
  };

  // Updated to only update nonceInputValue
  const handleNonceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNonceInputValue(value);
  };

  // Function to apply the nonce change when the button is clicked
  const applyNonceChange = () => {
    const newNonce = parseInt(nonceInputValue, 10);
    if (!Number.isNaN(newNonce)) {
      setNonce(newNonce);
      // Optionally, you can clear any messages or set a new message indicating the game has switched
      setCurrentGameState(prev => prev && { ...prev, message: "Switched to Game ID: " + newNonce });
    } else {
      // Handle invalid nonce input
      setCurrentGameState(prev => prev && { ...prev, message: "Please enter a valid Game ID (number)." });
    }
  };

  const changeBet = (newBet: number) => {
    setCurrentGameState(prev => prev && { ...prev, bet: newBet.toString() });
  };

  return (
    <div style={styles.container}>
      <div style={styles.connectKitContainer}>
        <ConnectButton />
      </div>

      <h1 style={styles.header}>Blackjack</h1>

      <div style={styles.balanceContainer}>
        <h2 style={styles.balanceText}>Your Balance: ${userBalance}</h2>

        {/* Nonce Input and Load Game Button */}
        <div style={styles.nonceContainer}>
          <label htmlFor="nonce" style={styles.betLabel}>
            Game ID (Nonce):
          </label>
          <input
            id="nonce"
            type="text"
            value={nonceInputValue}
            onChange={handleNonceInputChange}
            style={styles.betInput}
            placeholder="Enter Nonce"
          />
          <button onClick={applyNonceChange} style={styles.backButton}>
            Load Game
          </button>
        </div>

        <h3 style={styles.playerTotalText}>Player Total: {currentGameState?.playerTotal}</h3>
        <h3 style={styles.dealerTotalText}>Dealer Total: {calculateVisibleDealerTotal()}</h3>
        <div>
          <h3 style={styles.playerTotalText}>Bet: {currentGameState?.bet}</h3>
        </div>
        {currentGameState?.gameOver && currentGameState?.playerHand.length === 0 && (
          <div style={styles.betContainer}>
            <label htmlFor="bet" style={styles.betLabel}>
              Place Your Bet:
            </label>
            <input
              id="bet"
              type="text"
              value={currentGameState?.bet}
              onChange={handleBetChange}
              disabled={!currentGameState?.gameOver}
              style={styles.betInput}
              placeholder="Enter Bet Amount"
            />
          </div>
        )}
      </div>

      {currentGameState?.gameOver && currentGameState?.playerHand.length === 0 && (
        <>
          <BlackjackGameInt
            bet={currentGameState?.bet}
            handleStartGame={startGame}
            setMessage={msg => setCurrentGameState(prev => prev && { ...prev, message: msg as string })}
          />

          <button onClick={handleBack} style={styles.backButton}>
            Back to Home
          </button>
          {currentGameState?.message && <h3 style={styles.message}>{currentGameState?.message}</h3>}
        </>
      )}

      {!currentGameState?.gameOver && (
        <div style={styles.gameContainer}>
          <div style={styles.handsContainer}>
            <Hand hand={currentGameState?.playerHand || []} title="Player Hand" />
            <Hand hand={currentGameState?.dealerHand || []} title="Dealer Hand" hidden={!currentGameState?.gameOver} />
          </div>
          <div style={styles.actionButtonsContainer}>
            <button onClick={playerHit} style={styles.actionButton}>
              Hit
            </button>
            <button onClick={playerStand} style={styles.actionButton}>
              Stand
            </button>
          </div>
          {currentGameState?.message && <h3 style={styles.message}>{currentGameState?.message}</h3>}
        </div>
      )}

      {currentGameState?.gameOver && currentGameState?.playerHand.length > 0 && (
        <div style={styles.gameContainer}>
          <div style={styles.handsContainer}>
            <Hand hand={currentGameState?.playerHand || []} title="Player Hand" />
            <Hand hand={currentGameState?.dealerHand || []} title="Dealer Hand" hidden={false} />
          </div>
          {currentGameState?.message && <h3 style={styles.message}>{currentGameState?.message}</h3>}
          <button onClick={startNextHand} style={styles.startButton} disabled={userBalance < val}>
            Next Hand
          </button>

          {/* Bet Input for Next Hand */}
          <div style={styles.betContainer}>
            <label htmlFor="bet" style={styles.betLabel}>
              Enter New Bet:
            </label>
            <input
              id="bet"
              type="text"
              onChange={e => changeBet(parseFloat(e.target.value))}
              disabled={!currentGameState?.gameOver}
              style={styles.betInputLarge}
              placeholder="Enter New Bet"
            />
          </div>

          <button onClick={handleBack} style={styles.backButton}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default BlackjackGame;
