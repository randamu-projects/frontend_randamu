// ThreeBayReadCalls.tsx
"use client";

import React, { useEffect } from "react";
import deployedContracts from "../../contracts/deployedContracts";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";

// ThreeBayReadCalls.tsx

// ThreeBayReadCalls.tsx

// ThreeBayReadCalls.tsx

// ThreeBayReadCalls.tsx

// ThreeBayReadCalls.tsx

// ThreeBayReadCalls.tsx

// ThreeBayReadCalls.tsx

// ThreeBayReadCalls.tsx

// ThreeBayReadCalls.tsx

interface ThreeBayAuctionProps {
  // NFT.
  auctionId: string;
  onNftAddressRetrieved: (nftAddress: Address) => void;
}

const ThreeBayReadCalls: React.FC<ThreeBayAuctionProps> = ({ auctionId, onNftAddressRetrieved }) => {
  const chainId = 31337;

  // Retrieve the contract information
  const threeBayContractInfo = deployedContracts[chainId].ThreeBay; // Adjust the key based on your contract name
  const threeBayContractAddress = threeBayContractInfo.address as Address;
  const threeBayContractABI = threeBayContractInfo.abi;
  const bidAbi = threeBayContractABI.find(fn => fn.type === "function" && fn.name === "bid");

  // Read auction data from the contract
  const { data: nft } = useReadContract({
    address: threeBayContractAddress,
    abi: threeBayContractABI,
    functionName: "getAuctionData",
    args: [auctionId],
    chainId: chainId,
  });

  // Destructure the returned data
  const [
    nftAddress,
    tokenId,
    seller,
    reservePrice,
    startTimeBlockHeight,
    endTimeBlockHeight,
    counter,
    state,
    highestBidder,
    highestBidAmount,
  ] = nft || [];

  // Use useEffect to call the callback when nftAddress is updated
  useEffect(() => {
    if (nftAddress) {
      onNftAddressRetrieved(nftAddress as Address);
    }
  }, [nftAddress, onNftAddressRetrieved]);

  const initialFormBidValues = {
    auctionId: auctionId,
    encryptedPrice: "",
  };

  return (
    <div>
      {/* Display auction data */}

      {/* Using WriteOnlyFunctionForm to call the bid function */}
      {bidAbi && (
        <WriteOnlyFunctionForm
          abi={threeBayContractABI}
          abiFunction={bidAbi}
          contractAddress={threeBayContractAddress}
          initialFormValues={initialFormBidValues}
          buttonText="Bid"
          hideFunctionInputs={true}
          onChange={() => {
            console.log("Bid successful!");
          }}
        />
      )}
    </div>
  );
};

export default ThreeBayReadCalls;
