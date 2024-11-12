import React, { useEffect, useState } from 'react';
import { useReadContract, useAccount } from 'wagmi'; // replace with your actual package for contract reading
import deployedContracts from "~~/contracts/deployedContracts";
import { styles } from "../../styles/BlackJackGameStyles";

const chainId = 31337; // Ensure this matches your deployedContracts
const blackJackContractInfo = deployedContracts[chainId].Blackjack;
const blackJackContractAddress = blackJackContractInfo.address;
const blackJackContractABI = blackJackContractInfo.abi;

type BlackJackUserBalanceProps = {
    userAddress: string;
  };

function GameComponent({userAddress}) {
  const [nonceInputValue, setNonceInputValue] = useState('');
  const [lastNonce, setLastNonce] = useState('');

  // Function to fetch the last nonce
  const getLastNonce = () => {
    const { data: nonce } = useReadContract({
      address: blackJackContractAddress,
      abi: blackJackContractABI,
      functionName: "nonces",
      chainId: chainId,
      args: [userAddress || ""],
    });
    return nonce?.toString();
  };

  // useEffect to update lastNonce periodically
  useEffect(() => {
    const fetchLastNonce = async () => {
        if (!userAddress){
            setLastNonce("Not Connected");
        } else{
            const nonce = await getLastNonce();
            setLastNonce(nonce || "Loading...");
        }
    };
    
    fetchLastNonce(); // Fetch initially
    
    const interval = setInterval(fetchLastNonce, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [userAddress]);

  // Function to handle Load Game button click
  const applyNonceChange = () => {
    // logic to load game based on nonceInputValue
  };

  return (
    <div style={styles.nonceContainer}>
      <label htmlFor="nonce" style={styles.betLabel}>
        Game ID (Nonce):
      </label>
      <input
        id="nonce"
        type="text"
        value={nonceInputValue}
        onChange={(e) => setNonceInputValue(e.target.value)}
        style={styles.betInput}
        placeholder="Enter Nonce"
      />
      <button onClick={applyNonceChange} style={styles.backButton}>
        Load Game
      </button>
      
      {/* Display Last Game nonce */}
      <p style={styles.subText}>
        Last Game: <strong>{lastNonce || "Loading..."}</strong>
      </p>
    </div>
  );
}

export default GameComponent;
