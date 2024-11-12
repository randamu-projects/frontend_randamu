// BlackJackUserBalance.tsx
"use client";

import deployedContracts from "../../contracts/deployedContracts";
import { Address, formatUnits } from "viem";
import { useReadContract } from "wagmi";

// BlackJackUserBalance.tsx

// BlackJackUserBalance.tsx

// BlackJackUserBalance.tsx

// BlackJackUserBalance.tsx

// BlackJackUserBalance.tsx

type BlackJackUserBalanceProps = {
  userAddress: string;
};

const BlackJackUserBalance: React.FC<BlackJackUserBalanceProps> = ({ userAddress }) => {
  // Retrieve the DumbERC20 contract information
  const dumbERC20ContractInfo = deployedContracts[31337].DumbERC20;
  const dumbERC20Address = dumbERC20ContractInfo.address as Address;
  const dumbERC20ABI = dumbERC20ContractInfo.abi;

  // Use the useReadContract hook to fetch the balance
  const { data: balanceData } = useReadContract({
    address: dumbERC20Address,
    abi: dumbERC20ABI,
    functionName: "balanceOf",
    chainId: 31337,
    args: [userAddress],
  });

  // Function to format the balance from wei to a readable format
  const formatBalance = (balance: bigint | undefined): string => {
    if (balance === undefined) return "0";
    // Assuming the token has 18 decimals
    return formatUnits(balance, 18).slice(0, -16);
  };

  return (
    <div className="card bg-gradient-to-r from-green-400 to-blue-500 text-neutral-content shadow-xl px-12 py-6 rounded-lg">
      <div className="card-body text-center">
        <h2 className="card-title text-2xl font-bold">Your Fake Money</h2>
        <p className="text-4xl font-semibold mt-4">
          Balance: <span className="text-white">{formatBalance(balanceData)}</span> FM
        </p>
      </div>
    </div>
  );
};

// Basic styling for the component
const styles = {
  container: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    maxWidth: "300px",
    margin: "1rem auto",
    textAlign: "center" as const,
  },
};

export default BlackJackUserBalance;
