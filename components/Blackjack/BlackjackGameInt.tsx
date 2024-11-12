// BlackjackGameInt.tsx
"use client";

import React, { useEffect, useState } from "react";
import deployedContracts from "../../contracts/deployedContracts";

import { Address } from "viem";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";
import { randamu } from "~~/randmu";
import { styles } from "~~/styles/BlackJackGameStyles";

// BlackjackGameInt.tsx

type BlackjackGameIntProps = {
  bet: string;
  handleStartGame: () => void;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

const BlackjackGameInt: React.FC<BlackjackGameIntProps> = ({ bet, handleStartGame, setMessage }) => {
  const { address: userAddress } = useAccount();
  const [gameID, setGameID] = useState<string>("");


  // Contract Information
  const blackJackContractInfo = deployedContracts[31337].Blackjack;
  const tokenContractInfo = deployedContracts[31337].DumbERC20;
  const blackJackContractAddress = blackJackContractInfo.address as Address;
  const blackJackContractABI = blackJackContractInfo.abi;
  const tokenContractAddress = tokenContractInfo.address as Address;
  const tokenContractABI = tokenContractInfo.abi;

  // ABIs for specific functions
  const approveABI = tokenContractABI.find(fn => fn.type === "function" && fn.name === "approve");
  const initiateGameABI = blackJackContractABI.find(fn => fn.type === "function" && fn.name === "initiateGame");
  const executeActionABI = blackJackContractABI.find(fn => fn.type === "function" && fn.name === "executeAction");
  // Read the allowance
  let { data: allowanceData } = useReadContract({
    address: tokenContractAddress,
    abi: tokenContractABI,
    functionName: "allowance",
    chainId: randamu.id,
    args: [userAddress || "", blackJackContractAddress],
  });

  // Watch for GameCreated event to get the gameID
  useWatchContractEvent({
    address: blackJackContractAddress,
    abi: blackJackContractABI,
    eventName: "GameCreated",
    chainId: randamu.id,
    onLogs(logs) {
      logs.forEach(log => {
        // Extract the gameId from the log arguments
        const gameId = log.args?.gameId;
        if (gameId) {
          console.log("GameCreated event detected. Game ID:", gameId);
          // Update the gameID state
          setGameID(gameId);
        } else {
          console.warn("No gameId found in the log args.");
        }
      });
    },
  });

  // State Variables
  const [needsApproval, setNeedsApproval] = useState(true);

  // Form Values for Contract Functions
  const initialFormValuesApprove = {
    _spender: blackJackContractAddress,
    _value: BigInt(bet || "0") * BigInt(10 ** 18),
  };

  const initialFormValuesInitiate = {
    userStake: BigInt(bet || "0") * BigInt(10 ** 18),
  };

  useEffect(() => {
    const betAmountBigInt = BigInt(bet || "0") * BigInt(10 ** 18);
    if (allowanceData === undefined || allowanceData < betAmountBigInt) {
      setNeedsApproval(true);
    } else {
      setNeedsApproval(false);
    }
  }, [allowanceData, bet]);


  return (
    <div>
      {approveABI && needsApproval ? (
        // Render Approve button
        <WriteOnlyFunctionForm
          abi={tokenContractABI}
          abiFunction={approveABI}
          contractAddress={tokenContractAddress}
          initialFormValues={initialFormValuesApprove}
          hideFunctionInputs={true}
          buttonText="Approve"
          onChange={() => {
            allowanceData = BigInt(bet || "0") * BigInt(10 ** 18);
            setNeedsApproval(false);
            setMessage("Approval successful!");
          }}
        />
      ) : (
        <>
          {initiateGameABI && !gameID && (
            // Render Start Game button
            <WriteOnlyFunctionForm
              abi={blackJackContractABI}
              abiFunction={initiateGameABI}
              contractAddress={blackJackContractAddress}
              initialFormValues={initialFormValuesInitiate}
              hideFunctionInputs={true}
              buttonText="Start Game"
              onChange={() => {
                handleStartGame();
                setMessage("Game started!");
              }}
            />
          )}

          {executeActionABI && gameID && (
            <div style={styles.actionButtonsContainer}>
              <WriteOnlyFunctionForm
                abi={blackJackContractABI}
                abiFunction={executeActionABI}
                contractAddress={blackJackContractAddress}
                initialFormValues={{ gameId: gameID, action: 0 }}
                hideFunctionInputs={true}
                buttonText="Hit"
                onChange={() => {
                  handleStartGame();
                  setMessage("Action executed!");
                }}
              />

              <WriteOnlyFunctionForm
                abi={blackJackContractABI}
                abiFunction={executeActionABI}
                contractAddress={blackJackContractAddress}
                initialFormValues={{ gameId: gameID, action: 1 }}
                hideFunctionInputs={true}
                buttonText="Stand"
                onChange={() => {
                  handleStartGame();
                  setMessage("Action executed!");
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlackjackGameInt;
