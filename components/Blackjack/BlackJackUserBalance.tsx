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
    return formatUnits(balance, 18);
  };

  return (
    <div style={styles.container}>
      <h2>User Token Balance</h2>
      Balance: <strong>{formatBalance(balanceData)}</strong>
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
