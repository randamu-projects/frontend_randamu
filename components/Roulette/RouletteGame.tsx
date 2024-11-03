"use client";

// RouletteGame.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { styles } from "../../styles/RouletteGameStyles";
import RouletteBetComponent from "./RouletteBetFunction";
import RouletteWheel from "./RouletteWheel";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, useAnimation } from "framer-motion";
import { useAccount } from "wagmi";

const RouletteGame: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const { isConnected } = useAccount();
  const [spinning, setSpinning] = useState(false);
  const [probability, setProbability] = useState<number>(50); // Default value 50%
  const [bet, setBet] = useState<string>("");
  const [color, setColor] = useState<string>("red");
  const [rouletteResult, setRouletteResult] = useState<string | null>(null);
  const [segments, setSegments] = useState<string[]>([]);
  const controls = useAnimation();

  // Generate and shuffle the roulette segments
  const generateAndShuffleSegments = () => {
    const cases = 200;
    const sanitizedProbability = Math.min(Math.max(probability, 1), 100) || 1;
    const chosenColorCount = Math.floor((sanitizedProbability / 100) * cases);
    const otherColorCount = cases - chosenColorCount;
    const chosenColorSegments = Array(chosenColorCount).fill(color);
    const otherColor = color === "red" ? "black" : "red";
    const otherColorSegments = Array(otherColorCount).fill(otherColor);
    const allSegments = [...chosenColorSegments, ...otherColorSegments];

    return allSegments;
  };

  // Spin the roulette and handle result
  const spinRoulette = async () => {
    if (!isConnected) {
      alert("Please connect your wallet to play.");
      return;
    }

    //TODO: start the game

    //TODO: checker sur quel reseau il est connecté

    // Validate inputs
    const betAmount = parseFloat(bet);

    if (isNaN(betAmount) || betAmount < 5) {
      alert("Please enter a valid bet amount of at least 5.");
      return;
    }

    setSpinning(true);
    setRouletteResult(null); // Clear previous result

    const shuffledSegments = generateAndShuffleSegments();
    setSegments(shuffledSegments);
    const segmentAngle = 360 / shuffledSegments.length;

    // Decide win or lose based on probability
    const winProbability = probability / 100;

    // Get indices of segments matching player's chosen color and opposite color
    const matchingIndices: number[] = [];
    const oppositeIndices: number[] = [];
    const playerColor = color;

    shuffledSegments.forEach((segmentColor, index) => {
      if (segmentColor === playerColor) {
        matchingIndices.push(index);
      } else {
        oppositeIndices.push(index);
      }
    });

    //! HERE IS THE RESULT OF THE GAME
    const isWin = Math.random() < winProbability;

    // Select a random index based on win or lose
    let resultIndex: number;
    if (isWin && matchingIndices.length > 0) {
      // Player wins
      resultIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
    } else if (!isWin && oppositeIndices.length > 0) {
      // Player loses
      resultIndex = oppositeIndices[Math.floor(Math.random() * oppositeIndices.length)];
    } else {
      // Edge case handling if no segments are available
      resultIndex = Math.floor(Math.random() * shuffledSegments.length);
    }

    // Calculate rotation to stop at the result index
    const extraSpins = 5; // Number of extra full spins
    const spinDuration = 5; // Duration of the spin in seconds

    const randomOffset = Math.random() * segmentAngle * 0.8 + segmentAngle * 0.1; // between 10% and 90% of the segment

    const targetAngle = resultIndex * segmentAngle + randomOffset;

    // Adjust for the pointer being at 270 degrees (12 o'clock position)
    const pointerAngle = 270;

    // Calculate rotation needed
    const rotationNeeded = extraSpins * 360 + ((360 - targetAngle + pointerAngle) % 360);

    // Reset the animation
    await controls.start({ rotate: 0 });

    // Start the spin animation
    await controls.start({
      rotate: rotationNeeded,
      transition: { duration: spinDuration, ease: "easeOut" },
    });

    // After spin completes
    const result = shuffledSegments[resultIndex];
    setRouletteResult(result);
    setSpinning(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.connectKitContainer}>
        <ConnectButton />
      </div>

      <h1 style={styles.title}>Roulette Game</h1>
      {/* Inputs */}
      <div style={styles.inputsContainer}>
        {/* Input for bet amount */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Bet Amount:</label>

          <input
            type="number"
            value={bet}
            onChange={e => setBet(e.target.value)}
            style={styles.input}
            placeholder="Min 5"
            disabled={spinning}
          />
        </div>

        {/* Select for color */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Choose Color:</label>
          <select value={color} onChange={e => setColor(e.target.value)} style={styles.input} disabled={spinning}>
            <option value="red">Red</option>
            <option value="black">Black</option>
          </select>
        </div>
      </div>
      {/* Animated Roulette Wheel with Pointer */}
      <div style={{ position: "relative", marginTop: "20px" }}>
        {/* Pointer */}
        <div style={styles.pointer}></div>
        <motion.div style={{ width: 300, height: 300 }} animate={controls}>
          <RouletteWheel segments={segments.length > 0 ? segments : generateAndShuffleSegments()} />
        </motion.div>
      </div>
      {/* Slider for probability of winning */}
      <div style={styles.sliderContainer}>
        <label style={styles.label}>Winning Probability (%):</label>
        <input
          type="range"
          min="1"
          max="100"
          value={probability}
          onChange={e => setProbability(parseInt(e.target.value))}
          style={styles.slider}
          disabled={spinning}
        />
        <div style={styles.probabilityDisplay}>{probability}%</div>
      </div>
      {/* Spin button */}

      <RouletteBetComponent
        amount={(BigInt(bet) * BigInt(10 ** 18)).toString()}
        probability={probability * 100}
        onBetCompleted={spinRoulette}
      />

      {/* Display result only after the wheel stops spinning */}
      {!spinning && rouletteResult && (
        <div style={styles.result}>
          <h2>Roulette Result: {rouletteResult}</h2>
          {rouletteResult === color ? <p>You Win!</p> : <p>You Lose!</p>}
        </div>
      )}
      {/* Back to Home Button */}
      <button
        style={{
          ...styles.backButton,
          backgroundColor: spinning ? "#ccc" : "#1E90FF",
          cursor: spinning ? "not-allowed" : "pointer",
        }}
        onClick={handleBack}
        disabled={spinning}
      >
        Back to Home
      </button>
    </div>
  );
};

export default RouletteGame;
