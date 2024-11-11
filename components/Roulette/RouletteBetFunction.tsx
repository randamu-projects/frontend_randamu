import React, { useEffect, useState } from "react";
import { WriteOnlyFunctionForm } from "../../app/debug/_components/contract/WriteOnlyFunctionForm";
import deployedContracts from "../../contracts/deployedContracts";
import { Address } from "viem";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { randamu } from "~~/randmu";

interface RouletteBetComponentProps {
  amount: string;
  probability: number;
  onBetCompleted: () => void;
}

const RouletteBetComponent: React.FC<RouletteBetComponentProps> = ({ amount, probability, onBetCompleted }) => {
  const { address: userAddress } = useAccount();
  const rouletteContractInfo = deployedContracts[31337].Roulette;
  const tokenContractInfo = deployedContracts[31337].DumbERC20;
  const rouletteContractAddress = rouletteContractInfo.address as Address;
  const rouletteContractABI = rouletteContractInfo.abi;
  const tokenContractAddress = tokenContractInfo.address as Address;
  const tokenContractABI = tokenContractInfo.abi;
  const betFunctionABI = rouletteContractABI.find(fn => fn.type === "function" && fn.name === "bet");
  const approveFunctionABI = tokenContractABI.find(fn => fn.type === "function" && fn.name === "approve");

  const [needsApproval, setNeedsApproval] = useState(true);

  const { data: allowanceData } = useReadContract({
    address: tokenContractAddress,
    abi: tokenContractABI,
    functionName: "allowance",
    chainId: randamu.id,
    args: [userAddress || "", rouletteContractAddress],
  });

  console.log("Allowance: ", allowanceData);

  const initialFormValuesBet = {
    guessValue: BigInt(probability),
    _amount: amount,
  };

  const initialFormValuesApprove = {
    _spender: rouletteContractAddress,
    _value: amount,
  };

  console.log("Approve args: ", initialFormValuesApprove);
  console.log("Bet args: ", initialFormValuesBet);
  console.log("Numero: ", BigInt(amount));

  useEffect(() => {
    const betAmountBigInt = BigInt(amount);
    if (allowanceData !== undefined && allowanceData < betAmountBigInt) {
      setNeedsApproval(true);
    } else {
      setNeedsApproval(false);
    }
  }, [allowanceData, amount]);

  useWatchContractEvent({
    address: rouletteContractAddress,
    abi: rouletteContractABI,
    eventName: "BetConcludes",
    chainId: randamu.id,
    onLogs(logs) {
      console.log("Bet event logs: ", logs);
    },
  });

    
  return (
    <div style={{ padding: "20px" }}>
      <div>
        {(!betFunctionABI || !approveFunctionABI) && <div>Required functions are not found in the contract ABI.</div>}
        {needsApproval && approveFunctionABI ? (
          <div>
            <WriteOnlyFunctionForm
              abi={tokenContractABI}
              abiFunction={approveFunctionABI}
              contractAddress={tokenContractAddress}
              initialFormValues={initialFormValuesApprove}
              hideFunctionInputs={true}
              buttonText="Approve"
              onChange={() => {
                console.log("Approval transaction completed.");
                setNeedsApproval(false);
              }}
            />
          </div>
        ) : (
          <div>
            <WriteOnlyFunctionForm
              abi={rouletteContractABI}
              abiFunction={betFunctionABI}
              contractAddress={rouletteContractAddress}
              initialFormValues={initialFormValuesBet}
              hideFunctionInputs
              buttonText="Bet"
              onChange={() => {
                console.log("Bet transaction completed.");
                onBetCompleted();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteBetComponent;
