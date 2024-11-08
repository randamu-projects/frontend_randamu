// BlackjackGameInt.tsx
"use client";

import React, { useEffect, useState } from "react";
import deployedContracts from "../../contracts/deployedContracts";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useWaitForTransactionReceipt } from "wagmi";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";
import { randamu } from "~~/randmu";

// BlackjackGameInt.tsx

// BlackjackGameInt.tsx

// BlackjackGameInt.tsx

// BlackjackGameInt.tsx
type BlackjackGameIntProps = {
  bet: string;
  handleStartGame: () => void;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

const BlackjackGameInt: React.FC<BlackjackGameIntProps> = ({ bet, handleStartGame, setMessage }) => {
  const { address: userAddress } = useAccount();

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
  // const executeActionABI = blackJackContractABI.find(fn => fn.type === "function" && fn.name === "executeAction");

  // State Variables
  const [needsApproval, setNeedsApproval] = useState(true);

  // Form Values for Contract Functions
  const initialFormValuesApprove = {
    _spender: blackJackContractAddress,
    _value: BigInt(bet || "0") * BigInt(10 ** 18),
  };

  const initialFormValuesInitiate = {
    _betAmount: BigInt(bet || "0") * BigInt(10 ** 18),
  };

  // Read the allowance
  const { data: allowanceData } = useReadContract({
    address: tokenContractAddress,
    abi: tokenContractABI,
    functionName: "allowance",
    chainId: randamu.id,
    args: [userAddress || "", blackJackContractAddress],
  });

  useEffect(() => {
    const betAmountBigInt = BigInt(bet || "0") * BigInt(10 ** 18);
    if (allowanceData !== undefined && allowanceData < betAmountBigInt) {
      setNeedsApproval(true);
    } else {
      setNeedsApproval(false);
    }
  }, [allowanceData, bet]);

  const { data: txResult } = useWaitForTransactionReceipt({
    hash: result,
  });

  return (
    <div>
      {approveABI && needsApproval ? (
        <>
          <WriteOnlyFunctionForm
            abi={tokenContractABI}
            abiFunction={approveABI}
            contractAddress={tokenContractAddress}
            initialFormValues={initialFormValuesApprove}
            hideFunctionInputs={true}
            buttonText="Approve"
            onChange={() => {
              setNeedsApproval(false);
              setMessage("Approval successful!");
            }}
          />
        </>
      ) : (
        <>
          {initiateGameABI && (
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
        </>
      )}
    </div>
  );
};

export default BlackjackGameInt;
