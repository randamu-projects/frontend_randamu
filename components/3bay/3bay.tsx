// ThreeBayMarket.tsx
"use client";

import React, { useState } from "react";
import { CSSProperties } from "react";
import Image from "next/image";
import ThreeBayIntegration from "./3bayIntegration";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

// ThreeBayMarket.tsx

interface NFT {
  id: number;
  name: string;
  image: string;
  description: string;
  address?: string;
  dateMinted?: string;
  price?: number;
}

const mockNFTs: NFT[] = [
  {
    id: 1,
    name: "NFT Alpha",
    image: "/Nfts/nft1.png",
    description: "Description of NFT Alpha.",
    address: "0x123...",
    dateMinted: "2023-01-01",
    price: 100,
  },
  {
    id: 2,
    name: "NFT Beta",
    image: "/Nfts/nft2.png",
    description: "Description of NFT Beta.",
    address: "0x456...",
    dateMinted: "2023-02-01",
    price: 200,
  },
  {
    id: 3,
    name: "NFT Gamma",
    image: "/Nfts/nft2.png",
    description: "Description of NFT Gamma.",
    address: "0x789...",
    dateMinted: "2023-03-01",
    price: 300,
  },
  // Add more mock NFTs as needed
];

const ThreeBayMarket: React.FC = () => {
  const [selectedNFTIndex, setSelectedNFTIndex] = useState<number | null>(null);
  const [selectedNFTItem, setSelectedNFTItem] = useState<NFT | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedNFTs, setFetchedNFTs] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const { address, isConnected } = useAccount();

  const handleNFTClick = (item: any, index: number) => {
    if (selectedNFTIndex === index) {
      // NFT is already selected, deselect it
      setSelectedNFTIndex(null);
      setSelectedNFTItem(null);
    } else {
      // Select this NFT and deselect others
      setSelectedNFTIndex(index);
      setSelectedNFTItem(item);
    }
  };

  console.log(selectedNFTItem?.address);
  console.log(selectedNFTItem?.id);
  console.log(selectedNFTItem?.name);
  console.log(selectedNFTItem?.description);
  console.log(selectedNFTItem?.dateMinted);
  console.log(selectedNFTItem?.price);

  const handleNFTDoubleClick = (item: any, index: number) => {
    if (selectedNFTIndex === index) {
      // Open the modal
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Optionally, filter NFTs based on searchQuery
  const filteredNFTs = mockNFTs.filter(nft => nft.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // The getNft function
  async function getNft(address: string) {
    if (isConnected) {
      const apiUrl = `https://blockscout.firepit.network/api/v2/addresses/${address}/nft?type=ERC-721`;

      try {
        const response = await fetch(apiUrl, { mode: "no-cors" });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Update the state with the fetched data
        setFetchedNFTs(data);
      } catch (error) {
        console.error("Error:", error);
        // Optionally, handle the error state
        setFetchedNFTs(null);
      }
    } else {
      // If not connected, you might want to show a message or handle accordingly
      console.log("Wallet not connected");
    }
  }

  // Handler for the button click
  const handleFetchNfts = () => {
    if (address) {
      getNft(address);
    } else {
      console.log("No address found");
    }
  };

  console.log("Address:", address);

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
        className="search-input"
      />

      {/* Display the fetched NFTs */}
      {fetchedNFTs ? (
        <div style={styles.fetchedNftsContainer}>
          <h2>My NFTs:</h2>
          <div style={styles.gridContainer}>
            {fetchedNFTs.items.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  ...styles.nftCase,
                  ...(selectedNFTIndex === index ? styles.selectedNftCase : {}),
                }}
                onClick={() => handleNFTClick(item, index)}
                onDoubleClick={() => handleNFTDoubleClick(item, index)}
              >
                {item.token_instances[0]?.image_url && (
                  <img src={item.token_instances[0].image_url} alt={item.token.name} style={styles.nftImage} />
                )}
                <h3>{item.token.name}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // If no NFTs are fetched, display mock NFTs
        <div style={styles.gridContainer}>
          {filteredNFTs.map((nft, index) => (
            <div
              key={nft.id}
              style={{
                ...styles.nftCase,
                ...(selectedNFTIndex === index ? styles.selectedNftCase : {}),
              }}
              onClick={() => handleNFTClick(nft, index)}
              onDoubleClick={() => handleNFTDoubleClick(nft, index)}
            >
              <Image src={nft.image} alt={nft.name} style={styles.nftImage} width={500} height={500} />
            </div>
          ))}
        </div>
      )}

      {selectedNFTItem && (
        <button style={styles.closeButton} onClick={() => setShowModal(true)}>
          Show info
        </button>
      )}

      {/* Create Auction Button */}
      {/* Render ThreeBayIntegration when Create Auction is clicked */}
      {selectedNFTItem && <ThreeBayIntegration selectedNFT={selectedNFTItem} />}

      {/* Add the button to fetch NFTs */}
      <button style={styles.fetchButton} onClick={handleFetchNfts}>
        Refresh
      </button>

      {showModal && selectedNFTItem && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalBody}>
              {selectedNFTItem ? (
                <>
                  {selectedNFTItem?.image && (
                    <img src={selectedNFTItem.image} alt={selectedNFTItem.name} style={styles.modalImage} />
                  )}
                  <div style={styles.modalInfo}>
                    <h2>{selectedNFTItem.name}</h2>
                    <p>{selectedNFTItem.description}</p>
                    <p>Address: {selectedNFTItem.address}</p>
                    <p>Date Minted: {selectedNFTItem.dateMinted}</p>
                    {/* Add more info as needed */}
                  </div>
                </>
              ) : (
                <p>No NFT selected</p>
              )}
            </div>
            <button style={styles.closeButton} onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add a style block to change the placeholder text color */}
      <style jsx>{`
        .search-input::placeholder {
          color: black;
        }
      `}</style>
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
    backgroundColor: "lightblue",
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
    color: "black",
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    borderRadius: "8px",
    transition: "background-color 0.3s",
  },
  selectedNftCase: {
    backgroundColor: "#d0d0d0",
  },
  nftImage: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  fetchButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "5px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
  },
  createAuctionButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "5px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
  },
  fetchedNftsContainer: {
    marginTop: "20px",
    width: "80%",
    maxWidth: "800px",
    textAlign: "center" as const,
  },
  nftItem: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
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
    textAlign: "center" as const,
    position: "relative",
    maxWidth: "700px",
    width: "90%",
  },
  modalBody: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  modalInfo: {
    marginLeft: "20px",
    textAlign: "left" as const,
  },
  modalImage: {
    maxWidth: "300px",
    height: "auto",
    marginBottom: "20px",
  },
  closeButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#ff9800",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
