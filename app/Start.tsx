"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Start: React.FC = () => {
  const router = useRouter();

  const onGameSelect = (game: string) => {
    if (game === "Casino") {
      router.push("/Casino/");
    } else if (game === "3bayMarket") {
      router.push("/3bay");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.connectKitContainer}>
        <ConnectButton />
      </div>
      <h1 style={styles.title}>Welcome!</h1>
      <h2 style={styles.subtitle}>Choose Your Destination</h2>
      <div style={styles.optionsContainer}>
        <button style={styles.optionButton} onClick={() => onGameSelect("Casino")}>
          Go to Casino
        </button>
        <button style={styles.optionButton} onClick={() => onGameSelect("3bayMarket")}>
          Go to 3bayMarket
        </button>
      </div>
    </div>
  );
};

const styles = {
  connectKitContainer: {
    position: "absolute" as const,
    top: "20px",
    left: "20px",
    zIndex: 1000,
  },
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  title: {
    fontSize: "60px",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "30px",
    marginBottom: "40px",
  },
  optionsContainer: {
    display: "flex",
    gap: "20px",
  },
  optionButton: {
    fontSize: "24px",
    padding: "15px 30px",
    backgroundColor: "#ff9800",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s",
    outline: "none",
  },
};

export default Start;
