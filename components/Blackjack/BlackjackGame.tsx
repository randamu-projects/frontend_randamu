// BlackjackGame.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { styles } from "../../styles/BlackJackGameStyles";
import BlackJackUserBalance from "./BlackJackUserBalance";
import BlackjackGameInt from "./BlackjackGameInt";
import BlackJackGetHand from "./BlackjackGetCards";
import BlackjackGameComponent from "./BlackjackGameComponent";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWatchContractEvent, useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

// BlackjackGame.tsx

// BlackjackGame.tsx

// BlackjackGame.tsx

// BlackjackGame.tsx

const BlackjackGame: React.FC = () => {
  const chainId = 31337; // Ensure this matches your deployedContracts
  const blackJackContractInfo = deployedContracts[chainId].Blackjack;
  const blackJackContractAddress = blackJackContractInfo.address;
  const blackJackContractABI = blackJackContractInfo.abi;

  const [betConcluded, setBetConcluded] = useState<boolean>(false);
  const { address: userAddress } = useAccount();
  const router = useRouter();

  const [nonceInputValue, setNonceInputValue] = useState<string>("");
  const [nonce, setNonce] = useState<number>(0);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [bet, setBet] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [gameID, setGameID] = useState<string>("");

  const handleBack = () => {
    router.push("/");
  };

  const handleBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBet = event.target.value;
    setBet(newBet);
  };

  // Watch for GameCreated event to get the gameID
  useWatchContractEvent({
    address: blackJackContractAddress,
    abi: blackJackContractABI,
    eventName: "GameCreated",
    chainId: chainId,
    onLogs(logs) {
      logs.forEach(log => {
        // Extract the gameId from the log arguments
        const gameId = log.args?.gameId;
        if (gameId) {
          console.log("GameCreated event detected. Game ID:", gameId);
          // Update the gameID state
          setGameID(gameId);
          setBetConcluded(true);
          setGameOver(false); // Reset gameOver when a new game is created
        } else {
          console.warn("No gameId found in the log args.");
        }
      });
    },
  });

  // Function to apply the nonce change when the button is clicked
  const applyNonceChange = () => {
    const newNonce = parseInt(nonceInputValue, 10);
    if (!Number.isNaN(newNonce)) {
      setNonce(newNonce);
      setMessage("Switched to Game ID: " + newNonce);
      console.log("Switched to Game ID:", newNonce);
      setGameID(newNonce.toString());
      setGameOver(false); // Reset gameOver when switching game
    } else {
      setMessage("Please enter a valid Game ID (number).");
      console.warn("Invalid nonce input:", nonceInputValue);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.connectKitContainer}>
        <ConnectButton />
      </div>

      <h1 style={styles.header}>Blackjack</h1>

      <div style={styles.balanceContainer}>
        <h2 style={styles.balanceText}>{<BlackJackUserBalance userAddress={userAddress || ""} />}</h2>
        <h2 style={styles.balanceText}>{<BlackjackGameComponent userAddress={userAddress || ""} />}</h2>

        {!gameOver && (
          
          <div style={styles.betContainer}>
          <label htmlFor="bet" style={styles.betLabel}>
            Place Your Bet:
          </label>
          <div style={styles.inputWrapper}>
            <input
              id="bet"
              type="text"
              value={bet}
              onChange={handleBetChange}
              style={styles.betInput}
              placeholder="Enter Bet Amount"
            />
            <span style={styles.unitLabel}>FM</span>
          </div>
        </div>                            
        )}
      </div>

      {!gameOver && (
        <>
          <BlackjackGameInt
            bet={bet}
            handleStartGame={() => {
              // Start game logic here
              setGameOver(false);
              setMessage("");
              // Other game initialization logic
            }}
            setMessage={msg => {
              console.log("Setting message:", msg);
              setMessage(msg);
            }}
          />

          {gameID && betConcluded && (
            <div style={styles.gameContainer}>
              <div style={styles.handsContainer}>
                <BlackJackGetHand gameId={gameID} actor={0} />
                <BlackJackGetHand gameId={gameID} actor={1} hidden={!gameOver} />
              </div>
              {/* "Back to Home" button appears after the game ends */}
              {gameOver && (
                <button onClick={handleBack} style={styles.backButton}>
                  Back to Home
                </button>
              )}
            </div>
          )}

          {/* "Back to Home" button appears only before the game starts */}
          {!betConcluded && (
            <button onClick={handleBack} style={styles.backButton}>
              Back to Home
            </button>
          )}

          {message && <h3 style={styles.message}>{message}</h3>}
        </>
      )}

      {gameOver && (
        <div>
          <button
            onClick={() => {
              // Reset game logic here
              setGameOver(false);
              setBet("");
              setMessage("");
              // Other reset logic
            }}
            style={styles.startButton}
          >
            Start New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default BlackjackGame;
