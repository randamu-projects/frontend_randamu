// 3bayIntegration.tsx
"use client";

import React from "react";
import deployedContracts from "../../contracts/deployedContracts";
import { Address } from "viem";
import { useAccount, useWatchContractEvent } from "wagmi";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";

// 3bayIntegration.tsx

// 3bayIntegration.tsx

interface ThreeBayIntegrationProps {
  selectedNFT: any;
  conditions?: any;
}

const ThreeBayIntegration: React.FC<ThreeBayIntegrationProps> = ({ selectedNFT, conditions }) => {
  const { isConnected } = useAccount();

  // Replace 31337 with your actual chain ID if different
  const chainId = 31337;

  // Retrieve the contract information
  const threeBayContractInfo = deployedContracts[chainId].ThreeBay; // Adjust the key based on your contract name
  const threeBayContractAddress = threeBayContractInfo.address as Address;
  const threeBayContractABI = threeBayContractInfo.abi;

  // Find the createAuction function in the ABI
  const createAuctionABI = threeBayContractABI.find(fn => fn.type === "function" && fn.name === "createAuction");

  // Prepare initial form values using selectedNFT data
  const initialCreateAuctionValues = {
    nftAddress: selectedNFT.address || selectedNFT.address || "",
    nftId: selectedNFT.token_instances ? selectedNFT.id : selectedNFT.id || 0,
    startTime: Math.floor(Date.now() / 1000), // Current time as default
    endTime: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
    reservePrice: 10, // Default reserve price
    conditions: conditions || "",
    // Add other parameters as needed
  };

  console.log("True ", initialCreateAuctionValues);

  useWatchContractEvent({
    abi: threeBayContractABI,
    address: threeBayContractAddress,
    eventName: "AuctionCreated",
    onLogs(logs) {
      // Handle any state changes after the event is emitted
      console.log("AuctionCreated event emitted", logs);
    },
  });

  return (
    <div style={styles.integrationContainer}>
      {isConnected ? (
        createAuctionABI ? (
          <WriteOnlyFunctionForm
            abi={threeBayContractABI}
            abiFunction={createAuctionABI}
            contractAddress={threeBayContractAddress}
            initialFormValues={initialCreateAuctionValues}
            hideFunctionInputs={true} // Show inputs since createAuction has parameters
            buttonText="Create Auction"
            onChange={() => {
              // Handle any state changes after the function is called
              console.log("createAuction called");
            }}
          />
        ) : (
          <p>createAuction function not found in ABI.</p>
        )
      ) : (
        <p>Please connect your wallet to create an auction.</p>
      )}
    </div>
  );
};

export default ThreeBayIntegration;

const styles = {
  integrationContainer: {
    marginTop: "20px",
    textAlign: "center" as const,
  },
  integrationTitle: {
    fontSize: "24px",
    marginBottom: "10px",
  },
};
