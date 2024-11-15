// ThreeBayMarket.tsx
"use client";

import React, { useState } from "react";
import { CSSProperties } from "react";
import Image from "next/image";
import ThreeBayIntegration from "./3bayIntegration";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// ThreeBayMarket.tsx



interface NFT {
  id: number;
  name: string;
  image: string;
  address: string;
}

interface Auction {
  auctionId: string;
  nftAddress: string;
  tokenId: number;
  seller: string;
  reservePrice: number;
  startTimeBlockHeight: number;
  endTimeBlockHeight: number;
  counter: number;
  state: string;
  highestBidder: string;
  highestBidAmount: string;
}

const mockNFTs: NFT[] = [
  {
    id: 1,
    name: "NFT Alpha",
    image: "/Nfts/nft1.png",
    address: "0x123...",
  },
  {
    id: 2,
    name: "NFT Beta",
    image: "/Nfts/nft2.png",
    address: "0x456...",
  },
  {
    id: 3,
    name: "NFT Gamma",
    image: "/Nfts/nft2.png",
    address: "0x789...",
  },
  // Add more mock NFTs as needed
];

const mockAuctions: Auction[] = [
  {
    auctionId: "1",
    nftAddress: "0x123...",
    tokenId: 1,
    seller: "0xabc...",
    reservePrice: 10,
    startTimeBlockHeight: 1,
    endTimeBlockHeight: 100,
    counter: 0,
    state: "Open",
    highestBidder: "0xdef...",
    highestBidAmount: "15",
  },
  {
    auctionId: "2",
    nftAddress: "0x456...",
    tokenId: 2,
    seller: "0xabc...",
    reservePrice: 20,
    startTimeBlockHeight: 1,
    endTimeBlockHeight: 100,
    counter: 0,
    state: "Open",
    highestBidder: "0xdef...",
    highestBidAmount: "25",
  },
  // Add more mock auctions as needed
];

const ThreeBayMarket: React.FC = () => {
  const [selectedNFTIndex, setSelectedNFTIndex] = useState<number | null>(null);
  const [selectedNFTItem, setSelectedNFTItem] = useState<NFT | null>(null);
  const [selectedAuctionIndex, setSelectedAuctionIndex] = useState<number | null>(null);
  const [selectedAuctionItem, setSelectedAuctionItem] = useState<Auction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedNFTs, setFetchedNFTs] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [bidAmount, setBidAmount] = useState("");

  const handleNFTClick = (item: any, index: number) => {
    if (selectedNFTIndex === index) {
      setSelectedNFTIndex(null);
      setSelectedNFTItem(null);
    } else {
      setSelectedNFTIndex(index);
      setSelectedNFTItem(item);
    }
  };

  const handleAuctionClick = (auction: Auction, index: number) => {
    if (selectedAuctionIndex === index) {
      setSelectedAuctionIndex(null);
      setSelectedAuctionItem(null);
    } else {
      setSelectedAuctionIndex(index);
      setSelectedAuctionItem(auction);
    }
  };

  const handleNFTDoubleClick = (item: any, index: number) => {
    if (selectedNFTIndex === index) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleButton = () => {
    setToggle(!toggle);
    setSelectedAuctionIndex(null);
    setSelectedAuctionItem(null);
    setBidAmount("");
  };

  // Optionally, filter NFTs based on searchQuery
  const filteredNFTs = mockNFTs.filter(nft => nft.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handler for the button click (Mock function for fetching NFTs)
  const handleFetchNfts = () => {
    // Mock fetching NFTs
    console.log("Fetching NFTs...");
    setFetchedNFTs({ items: mockNFTs });
  };

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
      <button style={styles.fetchButton} onClick={handleFetchNfts}>
        Refresh
      </button>
      <button style={styles.fetchButton} onClick={handleToggleButton}>
        {toggle ? "Bid on NFTs" : "Create an auction"}
      </button>

      {toggle ? (
        // Auction mode: display auction list
        <div style={styles.auctionListContainer}>
          <h2>Auctions:</h2>
          <div style={styles.scrollList}>
            {mockAuctions.map((auction, index) => (
              <div
                key={index}
                style={{
                  ...styles.auctionItem,
                  ...(selectedAuctionIndex === index ? styles.selectedAuctionItem : {}),
                }}
                onClick={() => handleAuctionClick(auction, index)}
              >
                <p>NFT Address: {auction.nftAddress}</p>
                <p>Token ID: {auction.tokenId}</p>
                <p>Seller: {auction.seller}</p>
                <p>Reserve Price: {auction.reservePrice}</p>
                <p>Highest Bid: {auction.highestBidAmount}</p>
                {/* Add more auction details as needed */}
              </div>
            ))}
          </div>
          {selectedAuctionItem && (
            <div>
              <input
                type="number"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                style={styles.inputField}
              />
              <button style={styles.bidButton} onClick={() => console.log("Bid placed")}>
                Bid
              </button>
            </div>
          )}
        </div>
      ) : (
        // Search mode: display NFTs and allow to create auction
        <>
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
                    {item.image && <img src={item.image} alt={item.name} style={styles.nftImage} />}
                    <h3>{item.name}</h3>
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
            <div>
              <button style={styles.closeButton} onClick={() => setShowModal(true)}>
                Show info
              </button>
              {/* Display description and allow to create auction */}
              <div style={styles.nftDescription}>
                <h2>{selectedNFTItem.name}</h2>
                <p>Address: {selectedNFTItem.address}</p>
                {/* Add more NFT details as needed */}
              </div>
              <ThreeBayIntegration selectedNFT={selectedNFTItem} />
            </div>
          )}
        </>
      )}

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
                    <p>Address: {selectedNFTItem.address}</p>
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
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "5px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
    marginRight: "10px",
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
  auctionListContainer: {
    borderRadius: "8px",
    backgroundColor: "darkcyan",
    marginTop: "20px",
    width: "80%",
    maxWidth: "800px",
    textAlign: "center" as const,
  },
  scrollList: {
    maxHeight: "400px",
    overflowY: "scroll",
    border: "1px solid #ccc",
    padding: "10px",
  },
  auctionItem: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "left" as const,
  },
  selectedAuctionItem: {
    backgroundColor: "black",
  },
  inputField: {
    width: "80%",
    maxWidth: "300px",
    padding: "10px",
    marginTop: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  bidButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "5px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
  },
  nftDescription: {
    marginTop: "10px",
    textAlign: "center" as const,
  },
};
