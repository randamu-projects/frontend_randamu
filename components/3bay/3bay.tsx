"use client";

import React, { useState } from "react";
import { CSSProperties } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface NFT {
  id: number;
  name: string;
  image: string;
  description: string;
}

const mockNFTs: NFT[] = [
  {
    id: 1,
    name: "NFT Alpha",
    image: "/Nfts/nft1.png",
    description: "Description of NFT Alpha.",
  },
  {
    id: 2,
    name: "NFT Beta",
    image: "/Nfts/nft2.png",
    description: "Description of NFT Beta.",
  },
  {
    id: 3,
    name: "NFT Gamma",
    image: "/Nfts/nft2.png",
    description: "Description of NFT Beta.",
  },
  // Add more mock NFTs as needed
];

const ThreeBayMarket: React.FC = () => {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const handleCloseModal = () => {
    setSelectedNFT(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Optionally, filter NFTs based on searchQuery
  const filteredNFTs = mockNFTs.filter(nft => nft.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={styles.marketContainer}>
      <div style={styles.connectKitContainer}>
        <ConnectButton />
      </div>
      <h1 style={styles.title}>Welcome to 3bayMarket!</h1>
      <input
        type="text"
        placeholder="Search NFTs..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={styles.searchBar}
      />
      <div style={styles.gridContainer}>
        {filteredNFTs.map(nft => (
          <div key={nft.id} style={styles.nftCase} onClick={() => handleNFTClick(nft)}>
            <Image src={nft.image} alt={nft.name} style={styles.nftImage} width={500} height={500} />
          </div>
        ))}
      </div>

      {selectedNFT && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>{selectedNFT.name}</h2>
            <img src={selectedNFT.image} alt={selectedNFT.name} style={styles.modalImage} />
            <p>{selectedNFT.description}</p>
            <button style={styles.closeButton} onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeBayMarket;

const styles: { [key: string]: CSSProperties } = {
  connectKitContainer: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 1000,
  },
  marketContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  searchBar: {
    width: "80%",
    maxWidth: "500px",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gridGap: "10px",
    width: "80%",
    maxWidth: "800px",
    justifyContent: "center",
    alignItems: "center",
  },
  nftCase: {
    backgroundColor: "#f0f0f0",
    border: "2px solid #ccc",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    borderRadius: "8px",
  },
  nftImage: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    position: "relative",
    maxWidth: "500px",
    width: "90%",
  },
  modalImage: {
    maxWidth: "100%",
    height: "auto",
    marginBottom: "20px",
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#ff9800",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
