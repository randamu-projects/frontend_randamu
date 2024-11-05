"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const CasinoScreen: React.FC = () => {
  const router = useRouter();

  const onGameSelect = (game: string) => {
    if (game === "BlackJack") {
      router.push("/Casino/BlackJack");
    } else if (game === "Roulette") {
      router.push("/Casino/Roulette");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.connectKitContainer}>
        <ConnectButton />
      </div>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to the Casino!</h1>
        <h2 style={styles.subtitle}>Choose Your Game</h2>
        <div style={styles.gamesContainer}>
          <button style={styles.gameButton} onClick={() => onGameSelect("BlackJack")}>
            Play Blackjack
          </button>
          <button style={styles.gameButton} onClick={() => onGameSelect("Roulette")}>
            Play Roulette
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundImage: `url('/casino.jpg')`,
    backgroundSize: "cover",
    color: "#ffffff",
  },
  connectKitContainer: {
    position: "absolute" as const,
    top: "20px",
    left: "20px",
    zIndex: 1000,
  },
  content: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "60px",
    fontWeight: "bold" as const,
    fontFamily: "Courier New, monospace",
    marginBottom: "20px",
    textShadow: "2px 2px 5px #000000",
  },
  subtitle: {
    fontSize: "30px",
    fontFamily: "Arial, sans-serif",
    marginBottom: "40px",
    textShadow: "1px 1px 5px #000000",
  },
  gamesContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  gameButton: {
    fontSize: "24px",
    padding: "15px 30px",
    backgroundColor: "#ffeb3b",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "Verdana, sans-serif",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s",
    outline: "none",
  },
};

export default CasinoScreen;
